from rest_framework import serializers

from .models import OTPService, SMMService


class SMMServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMMService
        fields = (
            "id",
            "name",
            "platform",
            "category",
            "sell_per_1000",
            "min_quantity",
            "max_quantity",
            "description",
        )


class OTPServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTPService
        fields = (
            "id",
            "platform",
            "country_code",
            "country_name",
            "sell_price",
            "is_active",
        )
