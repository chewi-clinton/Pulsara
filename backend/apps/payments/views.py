import logging

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from . import cryptomus, notchpay
from .models import Payment

log = logging.getLogger(__name__)


def _fulfill(order_type: str, order_id_str: str):
    """Mark order as paid and dispatch the fulfillment task."""
    from apps.orders.tasks import fulfill_otp_order, fulfill_smm_order

    try:
        pk = int(order_id_str.replace(f"{order_type}_", ""))
    except ValueError:
        log.error("Cannot parse pk from order_id_str=%s", order_id_str)
        return

    if order_type == "smm":
        from apps.orders.models import SMMOrder
        try:
            order = SMMOrder.objects.get(pk=pk)
            if order.status == "pending_payment":
                order.status = "paid"
                order.save(update_fields=["status"])
                fulfill_smm_order.delay(pk)
        except SMMOrder.DoesNotExist:
            log.error("SMMOrder pk=%s not found", pk)

    elif order_type == "otp":
        from apps.orders.models import OTPOrder
        try:
            order = OTPOrder.objects.get(pk=pk)
            if order.status == "pending_payment":
                order.status = "paid"
                order.save(update_fields=["status"])
                fulfill_otp_order.delay(pk)
        except OTPOrder.DoesNotExist:
            log.error("OTPOrder pk=%s not found", pk)


class CryptomusWebhookView(APIView):
    """POST /api/webhooks/cryptomus/ — verify MD5 signature, mark order paid, trigger fulfilment."""

    permission_classes = [AllowAny]

    def post(self, request):
        payload = dict(request.data)
        if not cryptomus.verify_webhook(payload):
            return Response({"detail": "invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

        cmus_status = payload.get("status", "")
        order_id_str = payload.get("order_id", "")

        if order_id_str.startswith("smm_"):
            order_type = "smm"
        elif order_id_str.startswith("otp_"):
            order_type = "otp"
        else:
            return Response({"detail": "unknown order type"}, status=status.HTTP_400_BAD_REQUEST)

        Payment.objects.filter(
            order_type=order_type,
            provider_ref=payload.get("uuid"),
        ).update(
            status="paid" if cmus_status == "paid" else "pending",
            webhook_payload=payload,
        )

        if cmus_status == "paid":
            _fulfill(order_type, order_id_str)

        return Response({"detail": "ok"})


class NotchPayWebhookView(APIView):
    """POST /api/webhooks/notchpay/ — verify HMAC signature, mark order paid, trigger fulfilment."""

    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.headers.get("x-notch-signature", "")
        if not notchpay.verify_webhook(dict(request.data), signature):
            return Response({"detail": "invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

        transaction = request.data.get("transaction") or {}
        np_status = transaction.get("status", "")
        reference = transaction.get("reference", "")

        if not reference:
            return Response({"detail": "missing reference"}, status=status.HTTP_400_BAD_REQUEST)

        if reference.startswith("smm_"):
            order_type = "smm"
        elif reference.startswith("otp_"):
            order_type = "otp"
        else:
            return Response({"detail": "unknown order type"}, status=status.HTTP_400_BAD_REQUEST)

        Payment.objects.filter(order_type=order_type, provider_ref=reference).update(
            status="paid" if np_status == "complete" else "failed",
            webhook_payload=request.data,
        )

        if np_status == "complete":
            _fulfill(order_type, reference)

        return Response({"detail": "ok"})
