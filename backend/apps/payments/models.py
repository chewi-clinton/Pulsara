from django.db import models

ORDER_TYPE_CHOICES = [
    ("smm", "SMM"),
    ("otp", "OTP"),
]

METHOD_CHOICES = [
    ("cryptomus", "CryptoMus"),
    ("flutterwave", "Flutterwave"),
]

STATUS_CHOICES = [
    ("pending", "Pending"),
    ("paid", "Paid"),
    ("failed", "Failed"),
    ("expired", "Expired"),
]


class Payment(models.Model):
    order_type = models.CharField(max_length=10, choices=ORDER_TYPE_CHOICES)
    order_id = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    provider_ref = models.CharField(max_length=255, null=True, blank=True)
    webhook_payload = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_type}_{self.order_id} ({self.status})"
