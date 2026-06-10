from decimal import Decimal

from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.payments import cryptomus, notchpay
from apps.payments.models import Payment
from apps.services.models import OTPService, SMMService

from .models import OTPOrder, SMMOrder
from .serializers import (
    OTPOrderCreateSerializer,
    OTPOrderStatusSerializer,
    SMMOrderCreateSerializer,
    SMMOrderStatusSerializer,
)


def _create_payment(order_type, order_pk, amount, payment_method, customer_email, frontend_order_url):
    order_id_str = f"{order_type}_{order_pk}"
    amount_str = str(amount.quantize(Decimal("0.01")))

    if payment_method == "cryptomus":
        pay = cryptomus.create_payment(
            order_id=order_id_str,
            amount=amount_str,
            return_url=frontend_order_url,
        )
        result = pay["result"]
        Payment.objects.create(
            order_type=order_type,
            order_id=order_pk,
            amount=amount,
            currency="USD",
            method="cryptomus",
            provider_ref=result.get("uuid"),
            webhook_payload=result,
        )
        return {
            "order_id": order_id_str,
            "amount": amount_str,
            "payment_method": "cryptomus",
            "payment": {
                "uuid": result.get("uuid"),
                "url": result.get("url"),
                "expires_at": result.get("expired_at"),
            },
        }

    if payment_method == "notchpay":
        callback_url = (
            f"{settings.FRONTEND_URL}/payment"
            f"?order_id={order_id_str}&method=notchpay&verifying=1"
        )
        pay = notchpay.create_payment(
            reference=order_id_str,
            amount=amount_str,
            callback_url=callback_url,
            customer_email=customer_email,
        )
        np_url = pay["transaction"]["authorization_url"]
        Payment.objects.create(
            order_type=order_type,
            order_id=order_pk,
            amount=amount,
            currency="USD",
            method="notchpay",
            provider_ref=order_id_str,
        )
        return {
            "order_id": order_id_str,
            "amount": amount_str,
            "payment_method": "notchpay",
            "redirect_url": np_url,
        }

    raise ValueError(f"Unsupported payment method: {payment_method}")


class SMMOrderCreateView(APIView):
    """POST /api/orders/smm/ — create order, generate payment, return payment details."""

    def post(self, request):
        serializer = SMMOrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        try:
            service = SMMService.objects.get(pk=d["service_id"], is_active=True)
        except SMMService.DoesNotExist:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

        sell_price = (Decimal(d["quantity"]) / Decimal("1000")) * service.sell_per_1000
        cost_price = (Decimal(d["quantity"]) / Decimal("1000")) * service.cost_per_1000

        order = SMMOrder.objects.create(
            service=service,
            target_url=d["target_url"],
            quantity=d["quantity"],
            cost_price=cost_price,
            sell_price=sell_price,
            payment_method=d["payment_method"],
            customer_email=d.get("customer_email") or "",
        )

        try:
            response_data = _create_payment(
                order_type="smm",
                order_pk=order.pk,
                amount=sell_price,
                payment_method=d["payment_method"],
                customer_email=d.get("customer_email") or "",
                frontend_order_url=f"{settings.FRONTEND_URL}/order/smm/smm_{order.pk}",
            )
            order.payment_ref = response_data.get("payment", {}).get("uuid") or order.pk
            order.save(update_fields=["payment_ref"])
        except Exception as exc:
            order.delete()
            return Response(
                {"detail": f"Payment gateway error: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(response_data, status=status.HTTP_201_CREATED)


class SMMOrderDetailView(RetrieveAPIView):
    """GET /api/orders/smm/<order_id>/ — current status of an SMM order."""

    queryset = SMMOrder.objects.all()
    serializer_class = SMMOrderStatusSerializer

    def get_object(self):
        raw = self.kwargs.get("order_id", "")
        try:
            pk = int(raw.replace("smm_", ""))
            return SMMOrder.objects.get(pk=pk)
        except (ValueError, SMMOrder.DoesNotExist):
            raise NotFound()


class OTPOrderCreateView(APIView):
    """POST /api/orders/otp/ — create order, generate payment."""

    def post(self, request):
        serializer = OTPOrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        try:
            service = OTPService.objects.get(pk=d["service_id"], is_active=True)
        except OTPService.DoesNotExist:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

        order = OTPOrder.objects.create(
            service=service,
            platform=d.get("platform") or service.platform,
            country_code=service.country_code,
            provider=service.provider,
            cost_price=service.cost_price,
            sell_price=service.sell_price,
            payment_method=d["payment_method"],
            customer_email=d.get("customer_email") or "",
        )

        try:
            response_data = _create_payment(
                order_type="otp",
                order_pk=order.pk,
                amount=service.sell_price,
                payment_method=d["payment_method"],
                customer_email=d.get("customer_email") or "",
                frontend_order_url=f"{settings.FRONTEND_URL}/order/otp/otp_{order.pk}",
            )
            order.payment_ref = response_data.get("payment", {}).get("uuid") or order.pk
            order.save(update_fields=["payment_ref"])
        except Exception as exc:
            order.delete()
            return Response(
                {"detail": f"Payment gateway error: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(response_data, status=status.HTTP_201_CREATED)


class OTPOrderDetailView(RetrieveAPIView):
    """GET /api/orders/otp/<order_id>/ — polled every 3s on the OTP waiting page."""

    queryset = OTPOrder.objects.all()
    serializer_class = OTPOrderStatusSerializer

    def get_object(self):
        raw = self.kwargs.get("order_id", "")
        try:
            pk = int(raw.replace("otp_", ""))
            return OTPOrder.objects.get(pk=pk)
        except (ValueError, OTPOrder.DoesNotExist):
            raise NotFound()


class OTPOrderCancelView(APIView):
    """POST /api/orders/otp/<order_id>/cancel/ — cancel before SMS arrives."""

    def post(self, request, order_id):
        try:
            pk = int(order_id.replace("otp_", ""))
            order = OTPOrder.objects.get(pk=pk)
        except (ValueError, OTPOrder.DoesNotExist):
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status not in ("paid", "waiting_sms"):
            return Response(
                {"detail": "Cannot cancel order in its current state."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.provider_session_id:
            try:
                from apps.providers import fivesim, smspool
                if order.provider == "smspool":
                    smspool.cancel_number(order.provider_session_id)
                elif order.provider == "5sim":
                    fivesim.cancel_number(order.provider_session_id)
            except Exception:
                pass

        order.status = "cancelled"
        order.save(update_fields=["status"])
        return Response({"detail": "Order cancelled."})
