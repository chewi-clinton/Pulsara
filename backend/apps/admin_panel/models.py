from django.db import models


class SiteSettings(models.Model):
    """Singleton row that stores provider/payment API key overrides."""

    smmfollowers_api_key = models.CharField(max_length=255, blank=True)
    smspool_api_key = models.CharField(max_length=255, blank=True)
    fivesim_api_key = models.CharField(max_length=255, blank=True)
    cryptomus_merchant_id = models.CharField(max_length=255, blank=True)
    cryptomus_payment_key = models.CharField(max_length=255, blank=True)
    flutterwave_public_key = models.CharField(max_length=255, blank=True)
    flutterwave_secret_key = models.CharField(max_length=255, blank=True)
    flutterwave_webhook_hash = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Site Settings"

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site Settings"
