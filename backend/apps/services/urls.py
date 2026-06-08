from django.urls import path

from . import views

urlpatterns = [
    path("smm/", views.SMMServiceListView.as_view(), name="smm-service-list"),
    path("otp/", views.OTPServiceListView.as_view(), name="otp-service-list"),
]
