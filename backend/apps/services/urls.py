from django.urls import path

from . import views

urlpatterns = [
    path("smm/", views.SMMServiceListView.as_view(), name="smm-service-list"),
    path("smm/<int:pk>/", views.SMMServiceDetailView.as_view(), name="smm-service-detail"),
    path("otp/", views.OTPServiceListView.as_view(), name="otp-service-list"),
    path("otp/<int:pk>/", views.OTPServiceDetailView.as_view(), name="otp-service-detail"),
]
