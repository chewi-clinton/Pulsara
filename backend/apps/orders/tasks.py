import logging
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

log = logging.getLogger(__name__)

SUPPORT_EMAIL = "support@pulsara.app"
ADMIN_EMAIL = getattr(settings, "ADMIN_EMAIL", "support@pulsara.app")
SITE_NAME = "Pulsara"


# ---------------------------------------------------------------------------
# Email helpers
# ---------------------------------------------------------------------------

def _send_order_failed_email(customer_email, order_ref, order_type, amount_usd):
    """Email the customer when their order could not be fulfilled."""
    if not customer_email:
        return
    subject = f"[{SITE_NAME}] Your order could not be completed — refund issued"
    body = (
        f"Hi,\n\n"
        f"We're sorry — your {order_type} order ({order_ref}) could not be fulfilled "
        f"because the service or number was unavailable from our provider at this time.\n\n"
        f"Your payment of ${amount_usd:.2f} USD has been marked for refund. "
        f"Depending on your payment method, the funds will be returned within 1–5 business days.\n\n"
        f"If you have any questions, please email us at {SUPPORT_EMAIL} and quote your order ID: {order_ref}.\n\n"
        f"We apologise for the inconvenience.\n\n"
        f"— The {SITE_NAME} Team"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [customer_email], fail_silently=True)
    except Exception as exc:
        log.warning("Failed to send order-failed email to %s: %s", customer_email, exc)


def _send_otp_expired_email(customer_email, order_ref, phone_number):
    """Email the customer when their OTP session expired without receiving a code."""
    if not customer_email:
        return
    subject = f"[{SITE_NAME}] Your OTP session expired"
    body = (
        f"Hi,\n\n"
        f"Your OTP number session for order {order_ref} has expired without receiving a verification code.\n\n"
        f"Number assigned: {phone_number or 'N/A'}\n\n"
        f"This can happen when the platform you are verifying with is slow to send SMS, "
        f"or when the number is blocked by that service.\n\n"
        f"If you believe this is an error, please contact us at {SUPPORT_EMAIL} "
        f"with your order ID: {order_ref}.\n\n"
        f"— The {SITE_NAME} Team"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [customer_email], fail_silently=True)
    except Exception as exc:
        log.warning("Failed to send otp-expired email to %s: %s", customer_email, exc)


def _alert_admin_refund(order_ref, order_type, amount_usd, reason, customer_email):
    """Notify admin that a manual refund may be needed."""
    subject = f"[{SITE_NAME}] Refund needed — {order_ref}"
    body = (
        f"Order {order_ref} ({order_type}) failed to fulfil and has been marked for refund.\n\n"
        f"Customer email: {customer_email or 'not provided'}\n"
        f"Amount: ${amount_usd:.2f} USD\n"
        f"Reason: {reason}\n\n"
        f"Please process the refund via the payment provider dashboard."
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [ADMIN_EMAIL], fail_silently=True)
    except Exception as exc:
        log.warning("Failed to send admin refund alert for %s: %s", order_ref, exc)


# ---------------------------------------------------------------------------
# Fulfillment tasks
# ---------------------------------------------------------------------------

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
            process_refund.delay("smm", order.pk)
            reason = str(exc)
            amount = float(order.sell_price)
            _send_order_failed_email(order.customer_email, f"smm_{order.pk}", "SMM", amount)
            _alert_admin_refund(f"smm_{order.pk}", "SMM", amount, reason, order.customer_email)


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
            process_refund.delay("otp", order.pk)
            reason = str(exc)
            amount = float(order.sell_price)
            _send_order_failed_email(order.customer_email, f"otp_{order.pk}", "OTP", amount)
            _alert_admin_refund(f"otp_{order.pk}", "OTP", amount, reason, order.customer_email)


# ---------------------------------------------------------------------------
# Polling tasks
# ---------------------------------------------------------------------------

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
                    _send_otp_expired_email(order.customer_email, f"otp_{order.pk}", order.phone_number)
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
                    _send_otp_expired_email(order.customer_email, f"otp_{order.pk}", order.phone_number)
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

    expired_qs = OTPOrder.objects.filter(
        status="waiting_sms",
        expires_at__lt=timezone.now(),
    )
    for order in expired_qs:
        order.status = "expired"
        order.save(update_fields=["status"])
        _send_otp_expired_email(order.customer_email, f"otp_{order.pk}", order.phone_number)


# ---------------------------------------------------------------------------
# Refund task
# ---------------------------------------------------------------------------

@shared_task
def process_refund(order_type: str, order_id: int):
    """Mark order and payment as refunded in the database."""
    from apps.payments.models import Payment
    from .models import SMMOrder, OTPOrder

    Payment.objects.filter(order_type=order_type, order_id=order_id).update(status="refunded")

    if order_type == "smm":
        SMMOrder.objects.filter(pk=order_id, status="failed").update(status="refunded")
    elif order_type == "otp":
        OTPOrder.objects.filter(pk=order_id, status="failed").update(status="refunded")

    log.info("process_refund: marked %s order %s as refunded", order_type, order_id)
