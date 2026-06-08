from django.urls import path

from . import views

urlpatterns = [
    path("cryptomus/", views.CryptomusWebhookView.as_view(), name="cryptomus-webhook"),
    path("flutterwave/", views.FlutterwaveWebhookView.as_view(), name="flutterwave-webhook"),
]
