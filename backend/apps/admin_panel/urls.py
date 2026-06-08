from django.urls import path

from . import views

urlpatterns = [
    path("auth/login/", views.AdminLoginView.as_view(), name="admin-login"),
    path("auth/refresh/", views.AdminTokenRefreshView.as_view(), name="admin-token-refresh"),
    path("dashboard/", views.DashboardView.as_view(), name="admin-dashboard"),
    path("orders/", views.AdminOrderListView.as_view(), name="admin-order-list"),
    path("orders/<str:order_id>/", views.AdminOrderDetailView.as_view(), name="admin-order-detail"),
    path("orders/<str:order_id>/refund/", views.AdminOrderRefundView.as_view(), name="admin-order-refund"),
    path("orders/<str:order_id>/retry/", views.AdminOrderRetryView.as_view(), name="admin-order-retry"),
    path("services/smm/", views.AdminSMMServiceListView.as_view(), name="admin-smm-service-list"),
    path("services/smm/<int:pk>/", views.AdminSMMServiceDetailView.as_view(), name="admin-smm-service-detail"),
    path("services/smm/sync/", views.AdminSMMServiceSyncView.as_view(), name="admin-smm-service-sync"),
    path("services/otp/", views.AdminOTPServiceListView.as_view(), name="admin-otp-service-list"),
    path("services/otp/<int:pk>/", views.AdminOTPServiceDetailView.as_view(), name="admin-otp-service-detail"),
    path("services/otp/sync/", views.AdminOTPServiceSyncView.as_view(), name="admin-otp-service-sync"),
    path("analytics/", views.AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("settings/", views.AdminSettingsView.as_view(), name="admin-settings"),
]
