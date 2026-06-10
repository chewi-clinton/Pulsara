from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import OTPService, SMMService
from .serializers import OTPServiceSerializer, SMMServiceSerializer


class SMMServiceListView(ListAPIView):
    """GET /api/services/smm/?platform=&category="""

    serializer_class = SMMServiceSerializer
    pagination_class = None

    def get_queryset(self):
        qs = SMMService.objects.filter(is_active=True)
        platform = self.request.query_params.get("platform")
        category = self.request.query_params.get("category")
        if platform:
            qs = qs.filter(platform=platform)
        if category:
            qs = qs.filter(category=category)
        return qs


class SMMServiceDetailView(RetrieveAPIView):
    """GET /api/services/smm/<pk>/"""

    queryset = SMMService.objects.filter(is_active=True)
    serializer_class = SMMServiceSerializer


class OTPServiceListView(ListAPIView):
    """GET /api/services/otp/?platform=&country_code="""

    serializer_class = OTPServiceSerializer
    pagination_class = None

    def get_queryset(self):
        qs = OTPService.objects.filter(is_active=True)
        platform = self.request.query_params.get("platform")
        country_code = self.request.query_params.get("country_code")
        if platform:
            qs = qs.filter(platform=platform)
        if country_code:
            qs = qs.filter(country_code=country_code)
        return qs


class OTPServiceDetailView(RetrieveAPIView):
    """GET /api/services/otp/<pk>/"""

    queryset = OTPService.objects.filter(is_active=True)
    serializer_class = OTPServiceSerializer
