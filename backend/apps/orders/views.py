from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import OTPOrder, SMMOrder
from .serializers import (
    OTPOrderCreateSerializer,
    OTPOrderStatusSerializer,
    SMMOrderCreateSerializer,
    SMMOrderStatusSerializer,
)


class SMMOrderCreateView(APIView):
    """POST /api/orders/smm/ — create order, generate payment link, return payment_url."""

    def post(self, request):
        serializer = SMMOrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class SMMOrderDetailView(RetrieveAPIView):
    """GET /api/orders/smm/<order_id>/ — current status of an SMM order."""

    queryset = SMMOrder.objects.all()
    serializer_class = SMMOrderStatusSerializer
    lookup_url_kwarg = "order_id"


class OTPOrderCreateView(APIView):
    """POST /api/orders/otp/ — create order, generate payment link."""

    def post(self, request):
        serializer = OTPOrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class OTPOrderDetailView(RetrieveAPIView):
    """GET /api/orders/otp/<order_id>/ — polled every 3s on the OTP waiting page."""

    queryset = OTPOrder.objects.all()
    serializer_class = OTPOrderStatusSerializer
    lookup_url_kwarg = "order_id"


class OTPOrderCancelView(APIView):
    """POST /api/orders/otp/<order_id>/cancel/ — cancel before SMS arrives, triggers refund."""

    def post(self, request, order_id):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
