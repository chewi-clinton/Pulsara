import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

log = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def fulfill_smm_order(self, order_pk: int):
    """Place the SMM order with SMMFollowers after payment is confirmed."""
    from apps.providers import smmfollowers
    from .models import SMMOrder

    try:
        order = SMMOrder.objects.select_related("service").get(pk=order_pk)
    except SMMOrder.DoesNotExist:
        return

    if order.status != "paid":
        return

    try:
        result = smmfollowers.place_order(
            service_id=order.service.provider_service_id,
            link=order.target_url,
            quantity=order.quantity,
        )
        order.provider_order_id = str(result.get("order") or result.get("id", ""))
        order.status = "processing"
        order.save(update_fields=["provider_order_id", "status"])
    except Exception as exc:
        log.error("fulfill_smm_order failed for pk=%s: %s", order_pk, exc)
        try:
            raise self.retry(exc=exc)
        except self.MaxRetriesExceededError:
            order.status = "failed"
            order.save(update_fields=["status"])


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def fulfill_otp_order(self, order_pk: int):
    """Buy an OTP number from the provider after payment is confirmed."""
    from apps.providers.otp_router import get_otp_number
    from .models import OTPOrder

    try:
        order = OTPOrder.objects.select_related("service").get(pk=order_pk)
    except OTPOrder.DoesNotExist:
        return

    if order.status != "paid":
        return

    try:
        result = get_otp_number(
            platform=order.platform or order.service.platform,
            country=order.country_code,
        )
        provider = result["provider"]
        data = result["data"]

        if provider == "smspool":
            order.phone_number = data.get("phonenumber") or data.get("number", "")
            order.provider_session_id = str(data.get("order_id") or data.get("id", ""))
        else:
            order.phone_number = data.get("phone", "")
            order.provider_session_id = str(data.get("id", ""))

        order.provider = provider
        order.status = "waiting_sms"
        order.expires_at = timezone.now() + timedelta(minutes=20)
        order.save(update_fields=["phone_number", "provider_session_id", "provider", "status", "expires_at"])
    except Exception as exc:
        log.error("fulfill_otp_order failed for pk=%s: %s", order_pk, exc)
        try:
            raise self.retry(exc=exc)
        except self.MaxRetriesExceededError:
            order.status = "failed"
            order.save(update_fields=["status"])


@shared_task
def poll_otp_status():
    """Poll SMSPool / 5sim for incoming SMS on every active OTP order."""
    from apps.providers import fivesim, smspool
    from .models import OTPOrder

    active = OTPOrder.objects.filter(status="waiting_sms", expires_at__gt=timezone.now())
    for order in active:
        try:
            if order.provider == "smspool":
                data = smspool.check_sms(order.provider_session_id)
                sms_status = data.get("status")
                if sms_status == 3:
                    order.otp_code = data.get("sms") or data.get("code", "")
                    order.status = "received"
                    order.save(update_fields=["otp_code", "status"])
                elif sms_status == 2:
                    order.status = "expired"
                    order.save(update_fields=["status"])
            elif order.provider == "5sim":
                data = fivesim.check_sms(order.provider_session_id)
                sms_status = data.get("status", "")
                if sms_status in ("RECEIVED", "FINISHED"):
                    sms_list = data.get("sms") or []
                    order.otp_code = sms_list[0].get("text", "") if sms_list else ""
                    order.status = "received"
                    order.save(update_fields=["otp_code", "status"])
                elif sms_status in ("EXPIRED", "CANCELED"):
                    order.status = "expired"
                    order.save(update_fields=["status"])
        except Exception as exc:
            log.warning("poll_otp_status error for order pk=%s: %s", order.pk, exc)


@shared_task
def poll_smm_order_status():
    """Poll SMMFollowers for delivery progress on processing SMM orders."""
    from apps.providers import smmfollowers
    from .models import SMMOrder

    active = SMMOrder.objects.filter(
        status__in=["processing", "in_progress"],
        provider_order_id__isnull=False,
    ).exclude(provider_order_id="")

    for order in active:
        try:
            data = smmfollowers.check_status(order.provider_order_id)
            new_status = smmfollowers.STATUS_MAP.get(data.get("status", ""))
            if new_status and new_status != order.status:
                order.status = new_status
                order.save(update_fields=["status"])
        except Exception as exc:
            log.warning("poll_smm_order_status error for order pk=%s: %s", order.pk, exc)


@shared_task
def expire_otp_sessions():
    """Mark waiting_sms OTP orders that have passed expires_at as expired."""
    from .models import OTPOrder
    OTPOrder.objects.filter(
        status="waiting_sms",
        expires_at__lt=timezone.now(),
    ).update(status="expired")


@shared_task
def process_refund(order_type: str, order_id: int):
    """Mark payment as failed/refunded. Extend with provider refund APIs as needed."""
    from apps.payments.models import Payment
    Payment.objects.filter(order_type=order_type, order_id=order_id).update(status="failed")
