from django.urls import path

from . import views

urlpatterns = [
    path("smm/", views.SMMOrderCreateView.as_view(), name="smm-order-create"),
    path("smm/<str:order_id>/", views.SMMOrderDetailView.as_view(), name="smm-order-detail"),
    path("otp/", views.OTPOrderCreateView.as_view(), name="otp-order-create"),
    path("otp/<str:order_id>/", views.OTPOrderDetailView.as_view(), name="otp-order-detail"),
    path("otp/<str:order_id>/cancel/", views.OTPOrderCancelView.as_view(), name="otp-order-cancel"),
]
