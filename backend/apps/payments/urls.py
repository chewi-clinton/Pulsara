from django.urls import path

from . import views

urlpatterns = [
    path("cryptomus/", views.CryptomusWebhookView.as_view(), name="cryptomus-webhook"),
    path("notchpay/", views.NotchPayWebhookView.as_view(), name="notchpay-webhook"),
]
