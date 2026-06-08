from django.db import models

PLATFORM_CHOICES = [
    ("tiktok", "TikTok"),
    ("instagram", "Instagram"),
    ("facebook", "Facebook"),
    ("youtube", "YouTube"),
    ("twitter", "Twitter/X"),
    ("whatsapp", "WhatsApp"),
    ("telegram", "Telegram"),
    ("google", "Google"),
]

CATEGORY_CHOICES = [
    ("followers", "Followers"),
    ("likes", "Likes"),
    ("views", "Views"),
    ("comments", "Comments"),
    ("shares", "Shares"),
]

OTP_PROVIDER_CHOICES = [
    ("smspool", "SMSPool"),
    ("5sim", "5sim"),
]


class SMMService(models.Model):
    provider_service_id = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    cost_per_1000 = models.DecimalField(max_digits=10, decimal_places=4)
    sell_per_1000 = models.DecimalField(max_digits=10, decimal_places=4)
    min_quantity = models.IntegerField()
    max_quantity = models.IntegerField()
    is_active = models.BooleanField(default=True)
    description = models.TextField(null=True, blank=True)
    synced_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class OTPService(models.Model):
    platform = models.CharField(max_length=50)
    country_code = models.CharField(max_length=10)
    country_name = models.CharField(max_length=100)
    provider = models.CharField(max_length=20, choices=OTP_PROVIDER_CHOICES)
    provider_service_id = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=4)
    sell_price = models.DecimalField(max_digits=10, decimal_places=4)
    is_active = models.BooleanField(default=True)
    synced_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.platform} ({self.country_code})"
