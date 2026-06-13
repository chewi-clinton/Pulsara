from django.db import models

from apps.services.models import OTPService, SMMService

PAYMENT_METHOD_CHOICES = [
    ("cryptomus", "CryptoMus"),
    ("notchpay", "NotchPay"),
]

SMM_STATUS_CHOICES = [
    ("pending_payment", "Pending payment"),
    ("paid", "Paid"),
    ("processing", "Processing"),
    ("in_progress", "In progress"),
    ("completed", "Completed"),
    ("failed", "Failed"),
    ("refunded", "Refunded"),
]

OTP_STATUS_CHOICES = [
    ("pending_payment", "Pending payment"),
    ("paid", "Paid"),
    ("waiting_sms", "Waiting for SMS"),
    ("received", "Received"),
    ("expired", "Expired"),
    ("failed", "Failed"),
    ("cancelled", "Cancelled"),
    ("refunded", "Refunded"),
]


class SMMOrder(models.Model):
    service = models.ForeignKey(SMMService, on_delete=models.PROTECT, related_name="orders")
    target_url = models.TextField()
    quantity = models.IntegerField()
    cost_price = models.DecimalField(max_digits=10, decimal_places=4)
    sell_price = models.DecimalField(max_digits=10, decimal_places=4)
    status = models.CharField(max_length=20, choices=SMM_STATUS_CHOICES, default="pending_payment")
    provider_order_id = models.CharField(max_length=100, null=True, blank=True)
    customer_email = models.EmailField(max_length=255, null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_ref = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"smm_{self.pk}"


class OTPOrder(models.Model):
    service = models.ForeignKey(OTPService, on_delete=models.PROTECT, related_name="orders")
    platform = models.CharField(max_length=50)
    country_code = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=30, null=True, blank=True)
    otp_code = models.CharField(max_length=20, null=True, blank=True)
    provider = models.CharField(max_length=20)
    provider_session_id = models.CharField(max_length=100, null=True, blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=4)
    sell_price = models.DecimalField(max_digits=10, decimal_places=4)
    status = models.CharField(max_length=20, choices=OTP_STATUS_CHOICES, default="pending_payment")
    customer_email = models.EmailField(max_length=255, null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_ref = models.CharField(max_length=255, null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"otp_{self.pk}"
