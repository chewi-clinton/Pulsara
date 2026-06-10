import logging

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from . import cryptomus, flutterwave
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


class FlutterwaveWebhookView(APIView):
    """POST /api/webhooks/flutterwave/ — verify verif-hash header, mark order paid, trigger fulfilment."""

    permission_classes = [AllowAny]

    def post(self, request):
        if not flutterwave.verify_webhook(request.headers):
            return Response({"detail": "invalid hash"}, status=status.HTTP_400_BAD_REQUEST)

        fw_status = (request.data.get("data") or {}).get("status", "")
        tx_ref = (request.data.get("data") or {}).get("tx_ref", "")

        if not tx_ref:
            return Response({"detail": "missing tx_ref"}, status=status.HTTP_400_BAD_REQUEST)

        if tx_ref.startswith("smm_"):
            order_type = "smm"
        elif tx_ref.startswith("otp_"):
            order_type = "otp"
        else:
            return Response({"detail": "unknown order type"}, status=status.HTTP_400_BAD_REQUEST)

        Payment.objects.filter(order_type=order_type, provider_ref=tx_ref).update(
            status="paid" if fw_status == "successful" else "failed",
            webhook_payload=request.data,
        )

        if fw_status == "successful":
            _fulfill(order_type, tx_ref)

        return Response({"detail": "ok"})
