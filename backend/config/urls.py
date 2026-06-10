"""
URL configuration for the Nexora backend.

Maps onto the documented API surface:
  /api/services/...   -> apps.services
  /api/orders/...     -> apps.orders
  /api/webhooks/...   -> apps.payments
  /api/admin/...      -> apps.admin_panel (JWT protected)
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/services/", include("apps.services.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/webhooks/", include("apps.payments.urls")),
    path("api/admin/", include("apps.admin_panel.urls")),
]
