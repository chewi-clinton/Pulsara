from django.urls import path

from . import views

urlpatterns = [
    path("cryptomus/", views.CryptomusWebhookView.as_view(), name="cryptomus-webhook"),
    path("cryptomus", views.CryptomusWebhookView.as_view(), name="cryptomus-webhook-noslash"),
    path("notchpay/", views.NotchPayWebhookView.as_view(), name="notchpay-webhook"),
    path("notchpay", views.NotchPayWebhookView.as_view(), name="notchpay-webhook-noslash"),
]
