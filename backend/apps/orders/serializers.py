from rest_framework import serializers

from .models import OTPOrder, SMMOrder


class SMMOrderCreateSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    target_url = serializers.URLField()
    quantity = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=["cryptomus", "notchpay"])
    customer_email = serializers.EmailField(required=False, allow_blank=True)


class SMMOrderStatusSerializer(serializers.ModelSerializer):
    order_id = serializers.SerializerMethodField()
    service_name = serializers.CharField(source="service.name")

    class Meta:
        model = SMMOrder
        fields = (
            "order_id",
            "status",
            "service_name",
            "target_url",
            "quantity",
            "sell_price",
            "payment_method",
            "created_at",
        )

    def get_order_id(self, obj):
        return f"smm_{obj.pk}"


class OTPOrderCreateSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    platform = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=["cryptomus", "notchpay"])
    customer_email = serializers.EmailField(required=False, allow_blank=True)


class OTPOrderStatusSerializer(serializers.ModelSerializer):
    order_id = serializers.SerializerMethodField()
    country = serializers.CharField(source="service.country_name")
    seconds_remaining = serializers.SerializerMethodField()

    class Meta:
        model = OTPOrder
        fields = (
            "order_id",
            "status",
            "phone_number",
            "platform",
            "country",
            "otp_code",
            "expires_at",
            "seconds_remaining",
            "sell_price",
            "payment_method",
        )

    def get_order_id(self, obj):
        return f"otp_{obj.pk}"

    def get_seconds_remaining(self, obj):
        if not obj.expires_at:
            return None
        from django.utils import timezone
        remaining = (obj.expires_at - timezone.now()).total_seconds()
        return max(int(remaining), 0)
