from rest_framework import serializers


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class AdminOrderListSerializer(serializers.Serializer):
    """Flattened representation spanning SMMOrder and OTPOrder for the admin orders table."""

    order_id = serializers.CharField()
    type = serializers.ChoiceField(choices=["smm", "otp"])
    status = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=4)
    payment_method = serializers.CharField()
    created_at = serializers.DateTimeField()


class ServiceSellPriceUpdateSerializer(serializers.Serializer):
    sell_per_1000 = serializers.DecimalField(max_digits=10, decimal_places=4, required=False)
    sell_price = serializers.DecimalField(max_digits=10, decimal_places=4, required=False)
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(required=False)


class AdminSettingsSerializer(serializers.Serializer):
    smmfollowers_api_key = serializers.CharField(required=False, allow_blank=True)
    smspool_api_key = serializers.CharField(required=False, allow_blank=True)
    fivesim_api_key = serializers.CharField(required=False, allow_blank=True)
    cryptomus_merchant_id = serializers.CharField(required=False, allow_blank=True)
    cryptomus_payment_key = serializers.CharField(required=False, allow_blank=True)
    notchpay_public_key = serializers.CharField(required=False, allow_blank=True)
    notchpay_secret_key = serializers.CharField(required=False, allow_blank=True)
