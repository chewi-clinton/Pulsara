from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import AdminSettingsSerializer


class AdminLoginView(TokenObtainPairView):
    """POST /api/admin/auth/login/ -> { access, refresh }"""

    permission_classes = [AllowAny]


class AdminTokenRefreshView(TokenRefreshView):
    """POST /api/admin/auth/refresh/ -> { access }"""

    permission_classes = [AllowAny]


class DashboardView(APIView):
    """GET /api/admin/dashboard/ — revenue + order summary cards and top services."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminOrderListView(APIView):
    """GET /api/admin/orders/?type=&status=&date_from=&date_to=&page="""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminOrderDetailView(APIView):
    """GET /api/admin/orders/<order_id>/ — full order, payment, and provider info."""

    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminOrderRefundView(APIView):
    """POST /api/admin/orders/<order_id>/refund/ — manually trigger a refund."""

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminOrderRetryView(APIView):
    """POST /api/admin/orders/<order_id>/retry/ — re-submit a failed order to the provider."""

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminSMMServiceListView(APIView):
    """GET /api/admin/services/smm/ — all SMM services with cost and sell prices."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminSMMServiceDetailView(APIView):
    """PATCH /api/admin/services/smm/<id>/ — update sell price, name, description, active."""

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminSMMServiceSyncView(APIView):
    """POST /api/admin/services/smm/sync/ — trigger manual sync from SMMFollowers."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminOTPServiceListView(APIView):
    """GET /api/admin/services/otp/ — all OTP services with cost and sell prices."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminOTPServiceDetailView(APIView):
    """PATCH /api/admin/services/otp/<id>/ — update sell price or active status."""

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminOTPServiceSyncView(APIView):
    """POST /api/admin/services/otp/sync/ — trigger manual sync from SMSPool + 5sim."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminAnalyticsView(APIView):
    """GET /api/admin/analytics/?period=7d|30d|90d|all"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminSettingsView(APIView):
    """GET/POST /api/admin/settings/ — masked provider key statuses; update keys."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def post(self, request):
        serializer = AdminSettingsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
