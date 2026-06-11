from django.urls import path

from . import views

urlpatterns = [
    path("smm/", views.SMMServiceListView.as_view(), name="smm-service-list"),
    path("smm", views.SMMServiceListView.as_view(), name="smm-service-list-noslash"),
    path("smm/<int:pk>/", views.SMMServiceDetailView.as_view(), name="smm-service-detail"),
    path("smm/<int:pk>", views.SMMServiceDetailView.as_view(), name="smm-service-detail-noslash"),
    path("otp/", views.OTPServiceListView.as_view(), name="otp-service-list"),
    path("otp", views.OTPServiceListView.as_view(), name="otp-service-list-noslash"),
    path("otp/<int:pk>/", views.OTPServiceDetailView.as_view(), name="otp-service-detail"),
    path("otp/<int:pk>", views.OTPServiceDetailView.as_view(), name="otp-service-detail-noslash"),
]
