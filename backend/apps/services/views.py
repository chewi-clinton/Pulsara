from rest_framework.generics import ListAPIView

from .models import OTPService, SMMService
from .serializers import OTPServiceSerializer, SMMServiceSerializer


class SMMServiceListView(ListAPIView):
    """GET /api/services/smm/?platform=&category="""

    serializer_class = SMMServiceSerializer

    def get_queryset(self):
        queryset = SMMService.objects.filter(is_active=True)
        platform = self.request.query_params.get("platform")
        category = self.request.query_params.get("category")
        if platform:
            queryset = queryset.filter(platform=platform)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class OTPServiceListView(ListAPIView):
    """GET /api/services/otp/?platform="""

    serializer_class = OTPServiceSerializer

    def get_queryset(self):
        queryset = OTPService.objects.filter(is_active=True)
        platform = self.request.query_params.get("platform")
        if platform:
            queryset = queryset.filter(platform=platform)
        return queryset
