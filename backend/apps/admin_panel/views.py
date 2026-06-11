from decimal import Decimal

from django.conf import settings as django_settings
from django.db.models import Count, Q, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.orders.models import OTPOrder, SMMOrder
from apps.services.models import OTPService, SMMService

from .models import SiteSettings
from .serializers import AdminSettingsSerializer, ServiceSellPriceUpdateSerializer


class AdminLoginView(TokenObtainPairView):
    """POST /api/admin/auth/login/ -> { access, refresh }"""

    permission_classes = [AllowAny]


class AdminTokenRefreshView(TokenRefreshView):
    """POST /api/admin/auth/refresh/ -> { access }"""

    permission_classes = [AllowAny]


def _smm_to_dict(o, include_service=True):
    d = {
        "order_id": f"smm_{o.pk}",
        "type": "smm",
        "status": o.status,
        "amount": str(o.sell_price),
        "payment_method": o.payment_method,
        "created_at": o.created_at.isoformat(),
        "customer_email": o.customer_email or "",
        "service_name": o.service.name if include_service else "",
    }
    return d


def _otp_to_dict(o):
    return {
        "order_id": f"otp_{o.pk}",
        "type": "otp",
        "status": o.status,
        "amount": str(o.sell_price),
        "payment_method": o.payment_method,
        "created_at": o.created_at.isoformat(),
        "customer_email": o.customer_email or "",
        "service_name": f"{o.platform} OTP ({o.country_code})",
    }


class DashboardView(APIView):
    """GET /api/admin/dashboard/ — revenue + order summary cards and recent orders."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        paid_smm = SMMOrder.objects.exclude(status__in=["pending_payment", "refunded"])
        paid_otp = OTPOrder.objects.exclude(status__in=["pending_payment", "refunded"])

        smm_sell = paid_smm.aggregate(s=Sum("sell_price"))["s"] or Decimal("0")
        smm_cost = paid_smm.aggregate(c=Sum("cost_price"))["c"] or Decimal("0")
        otp_sell = paid_otp.aggregate(s=Sum("sell_price"))["s"] or Decimal("0")
        otp_cost = paid_otp.aggregate(c=Sum("cost_price"))["c"] or Decimal("0")

        total_revenue = smm_sell + otp_sell
        gross_profit = (smm_sell - smm_cost) + (otp_sell - otp_cost)
        total_orders = paid_smm.count() + paid_otp.count()
        active_otp = OTPOrder.objects.filter(status="waiting_sms").count()

        recent_smm = list(SMMOrder.objects.select_related("service").order_by("-created_at")[:5])
        recent_otp = list(OTPOrder.objects.order_by("-created_at")[:5])
        recent = [_smm_to_dict(o) for o in recent_smm] + [_otp_to_dict(o) for o in recent_otp]
        recent.sort(key=lambda x: x["created_at"], reverse=True)

        return Response({
            "total_revenue": f"{total_revenue:.2f}",
            "total_orders": total_orders,
            "active_otp_sessions": active_otp,
            "gross_profit": f"{gross_profit:.2f}",
            "recent_orders": recent[:5],
        })


class AdminOrderListView(APIView):
    """GET /api/admin/orders/?type=smm|otp|all&status=&search=&page="""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        order_type = request.query_params.get("type", "all")
        status_filter = request.query_params.get("status", "")
        search = request.query_params.get("search", "").strip()
        page = max(int(request.query_params.get("page", 1)), 1)
        page_size = 20

        results = []

        if order_type in ("all", "smm"):
            qs = SMMOrder.objects.select_related("service").order_by("-created_at")
            if status_filter:
                qs = qs.filter(status=status_filter)
            if search:
                qs = qs.filter(
                    Q(customer_email__icontains=search) |
                    Q(service__name__icontains=search) |
                    Q(target_url__icontains=search)
                )
            results.extend(_smm_to_dict(o) for o in qs)

        if order_type in ("all", "otp"):
            qs = OTPOrder.objects.order_by("-created_at")
            if status_filter:
                qs = qs.filter(status=status_filter)
            if search:
                qs = qs.filter(
                    Q(customer_email__icontains=search) |
                    Q(platform__icontains=search) |
                    Q(country_code__icontains=search)
                )
            results.extend(_otp_to_dict(o) for o in qs)

        results.sort(key=lambda x: x["created_at"], reverse=True)
        total = len(results)
        start = (page - 1) * page_size

        return Response({
            "count": total,
            "page": page,
            "page_size": page_size,
            "results": results[start:start + page_size],
        })


class AdminOrderDetailView(APIView):
    """GET /api/admin/orders/<order_id>/"""

    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        if order_id.startswith("smm_"):
            try:
                pk = int(order_id.replace("smm_", ""))
                o = SMMOrder.objects.select_related("service").get(pk=pk)
            except (ValueError, SMMOrder.DoesNotExist):
                return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
            return Response({
                **_smm_to_dict(o),
                "cost": str(o.cost_price),
                "platform": o.service.platform,
                "target_url": o.target_url,
                "quantity": o.quantity,
                "provider_order_id": o.provider_order_id or "",
                "payment_ref": o.payment_ref or "",
            })

        if order_id.startswith("otp_"):
            try:
                pk = int(order_id.replace("otp_", ""))
                o = OTPOrder.objects.select_related("service").get(pk=pk)
            except (ValueError, OTPOrder.DoesNotExist):
                return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
            return Response({
                **_otp_to_dict(o),
                "cost": str(o.cost_price),
                "phone_number": o.phone_number or "",
                "otp_code": o.otp_code or "",
                "provider": o.provider,
                "provider_session_id": o.provider_session_id or "",
                "country_code": o.country_code,
                "payment_ref": o.payment_ref or "",
                "expires_at": o.expires_at.isoformat() if o.expires_at else None,
            })

        return Response({"detail": "Invalid order ID."}, status=status.HTTP_400_BAD_REQUEST)


class AdminOrderRefundView(APIView):
    """POST /api/admin/orders/<order_id>/refund/"""

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        if order_id.startswith("smm_"):
            try:
                pk = int(order_id.replace("smm_", ""))
                order = SMMOrder.objects.get(pk=pk)
            except (ValueError, SMMOrder.DoesNotExist):
                return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
            if order.status == "refunded":
                return Response({"detail": "Already refunded."}, status=status.HTTP_400_BAD_REQUEST)
            order.status = "refunded"
            order.save(update_fields=["status"])
            return Response({"detail": "Refund issued."})

        if order_id.startswith("otp_"):
            try:
                pk = int(order_id.replace("otp_", ""))
                order = OTPOrder.objects.get(pk=pk)
            except (ValueError, OTPOrder.DoesNotExist):
                return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
            if order.status == "refunded":
                return Response({"detail": "Already refunded."}, status=status.HTTP_400_BAD_REQUEST)
            order.status = "refunded"
            order.save(update_fields=["status"])
            return Response({"detail": "Refund issued."})

        return Response({"detail": "Invalid order ID."}, status=status.HTTP_400_BAD_REQUEST)


class AdminOrderRetryView(APIView):
    """POST /api/admin/orders/<order_id>/retry/ — re-queue a failed SMM order."""

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        if not order_id.startswith("smm_"):
            return Response({"detail": "Retry is only supported for SMM orders."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            pk = int(order_id.replace("smm_", ""))
            order = SMMOrder.objects.get(pk=pk)
        except (ValueError, SMMOrder.DoesNotExist):
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        if order.status != "failed":
            return Response({"detail": "Only failed orders can be retried."}, status=status.HTTP_400_BAD_REQUEST)
        order.status = "paid"
        order.save(update_fields=["status"])
        return Response({"detail": "Order queued for retry."})


class AdminSMMServiceListView(APIView):
    """GET /api/admin/services/smm/"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        services = SMMService.objects.all().order_by("platform", "name")
        data = [{
            "id": s.id,
            "name": s.name,
            "platform": s.platform,
            "category": s.category,
            "cost_per_1000": str(s.cost_per_1000),
            "sell_per_1000": str(s.sell_per_1000),
            "min_quantity": s.min_quantity,
            "max_quantity": s.max_quantity,
            "is_active": s.is_active,
            "description": s.description or "",
            "synced_at": s.synced_at.isoformat() if s.synced_at else None,
        } for s in services]
        return Response(data)


class AdminSMMServiceDetailView(APIView):
    """PATCH /api/admin/services/smm/<id>/"""

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            service = SMMService.objects.get(pk=pk)
        except SMMService.DoesNotExist:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSellPriceUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        update_fields = []
        for field in ("name", "description", "is_active"):
            if field in d:
                setattr(service, field, d[field])
                update_fields.append(field)
        if "sell_per_1000" in d:
            service.sell_per_1000 = d["sell_per_1000"]
            update_fields.append("sell_per_1000")

        if update_fields:
            service.save(update_fields=update_fields)

        return Response({
            "id": service.id,
            "name": service.name,
            "sell_per_1000": str(service.sell_per_1000),
            "is_active": service.is_active,
        })


class AdminSMMServiceSyncView(APIView):
    """POST /api/admin/services/smm/sync/"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        from apps.providers import smmfollowers
        from apps.services.models import SMMService
        from apps.services.tasks import _guess_platform, _guess_category
        from datetime import datetime, timezone as dt_timezone

        try:
            services = smmfollowers.get_services()
        except Exception as exc:
            return Response({"detail": f"Provider error: {exc}"}, status=status.HTTP_502_BAD_GATEWAY)

        now = datetime.now(tz=dt_timezone.utc)
        existing_ids = set(SMMService.objects.values_list("provider_service_id", flat=True))
        fetched_ids = set()

        for svc in services:
            pid = str(svc.get("service") or svc.get("id", ""))
            if not pid:
                continue
            fetched_ids.add(pid)
            cost = float(svc.get("rate", 0))
            SMMService.objects.update_or_create(
                provider_service_id=pid,
                defaults={
                    "name": svc.get("name", ""),
                    "platform": _guess_platform(svc.get("name", "")),
                    "category": _guess_category(svc.get("name", "")),
                    "cost_per_1000": cost,
                    "sell_per_1000": round(cost * 1.40, 4),
                    "min_quantity": int(svc.get("min", 10)),
                    "max_quantity": int(svc.get("max", 100000)),
                    "is_active": True,
                    "synced_at": now,
                },
            )

        gone = existing_ids - fetched_ids
        if gone:
            SMMService.objects.filter(provider_service_id__in=gone).update(is_active=False)

        return Response({"detail": f"Synced {len(fetched_ids)} services, deactivated {len(gone)}."})



class AdminOTPServiceListView(APIView):
    """GET /api/admin/services/otp/"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        services = OTPService.objects.all().order_by("platform", "country_code")
        data = [{
            "id": s.id,
            "platform": s.platform,
            "country_code": s.country_code,
            "country_name": s.country_name,
            "provider": s.provider,
            "cost_price": str(s.cost_price),
            "sell_price": str(s.sell_price),
            "is_active": s.is_active,
            "synced_at": s.synced_at.isoformat() if s.synced_at else None,
        } for s in services]
        return Response(data)


class AdminOTPServiceDetailView(APIView):
    """PATCH /api/admin/services/otp/<id>/"""

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            service = OTPService.objects.get(pk=pk)
        except OTPService.DoesNotExist:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSellPriceUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        update_fields = []
        if "sell_price" in d:
            service.sell_price = d["sell_price"]
            update_fields.append("sell_price")
        if "is_active" in d:
            service.is_active = d["is_active"]
            update_fields.append("is_active")

        if update_fields:
            service.save(update_fields=update_fields)

        return Response({
            "id": service.id,
            "platform": service.platform,
            "country_code": service.country_code,
            "sell_price": str(service.sell_price),
            "is_active": service.is_active,
        })


class AdminOTPServiceSyncView(APIView):
    """POST /api/admin/services/otp/sync/"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        import requests as req
        from apps.services.models import OTPService
        from datetime import datetime, timezone as dt_timezone
        from django.conf import settings as django_settings

        PLATFORMS = ["whatsapp", "telegram", "google", "facebook", "instagram", "tinder", "twitter", "discord"]
        MARKUP = 1.40

        try:
            resp = req.get(
                "https://5sim.net/v1/guest/prices",
                headers={"Authorization": f"Bearer {django_settings.FIVESIM_API_KEY}"},
                timeout=30,
            )
            resp.raise_for_status()
            price_data = resp.json()
        except Exception as exc:
            return Response({"detail": f"Provider error: {exc}"}, status=status.HTTP_502_BAD_GATEWAY)

        now = datetime.now(tz=dt_timezone.utc)
        created = 0

        COUNTRY_NAMES = {
            "russia": "Russia", "usa": "United States", "ukraine": "Ukraine",
            "indonesia": "Indonesia", "india": "India", "brazil": "Brazil",
            "philippines": "Philippines", "vietnam": "Vietnam", "china": "China",
            "cambodia": "Cambodia", "myanmar": "Myanmar", "nigeria": "Nigeria",
            "kenya": "Kenya", "ghana": "Ghana", "england": "United Kingdom",
            "france": "France", "germany": "Germany", "canada": "Canada",
            "australia": "Australia", "mexico": "Mexico", "pakistan": "Pakistan",
            "bangladesh": "Bangladesh", "thailand": "Thailand", "malaysia": "Malaysia",
            "egypt": "Egypt", "ethiopia": "Ethiopia", "tanzania": "Tanzania",
            "southafrica": "South Africa", "cameroon": "Cameroon", "senegal": "Senegal",
            "cotedivoire": "Côte d'Ivoire", "morocco": "Morocco",
        }
        COUNTRY_CODES = {
            "russia": "RU", "usa": "US", "ukraine": "UA", "indonesia": "ID",
            "india": "IN", "brazil": "BR", "philippines": "PH", "vietnam": "VN",
            "china": "CN", "nigeria": "NG", "kenya": "KE", "ghana": "GH",
            "england": "GB", "france": "FR", "germany": "DE", "canada": "CA",
            "australia": "AU", "mexico": "MX", "pakistan": "PK", "bangladesh": "BD",
            "thailand": "TH", "malaysia": "MY", "egypt": "EG", "cameroon": "CM",
            "senegal": "SN", "morocco": "MA", "southafrica": "ZA", "cambodia": "KH",
            "myanmar": "MM", "cotedivoire": "CI", "ethiopia": "ET", "tanzania": "TZ",
        }

        for country, platforms in price_data.items():
            if country not in COUNTRY_CODES:
                continue
            for platform, operators in platforms.items():
                if platform not in PLATFORMS:
                    continue
                if not operators:
                    continue
                costs = [op.get("cost", 0) for op in operators.values() if isinstance(op, dict) and op.get("count", 0) > 0]
                if not costs:
                    continue
                cost = min(costs)
                if cost <= 0:
                    continue
                sell = round(cost * MARKUP, 4)
                OTPService.objects.update_or_create(
                    provider="5sim",
                    platform=platform,
                    country_code=COUNTRY_CODES[country],
                    defaults={
                        "country_name": COUNTRY_NAMES.get(country, country.title()),
                        "provider_service_id": f"5sim_{country}_{platform}",
                        "cost_price": cost,
                        "sell_price": sell,
                        "is_active": True,
                        "synced_at": now,
                    },
                )
                created += 1

        return Response({"detail": f"Synced {created} OTP services."})



class AdminAnalyticsView(APIView):
    """GET /api/admin/analytics/?period=7d|30d|90d|all"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get("period", "30d")
        now = timezone.now()
        period_map = {"7d": 7, "30d": 30, "90d": 90}
        start = now - timedelta(days=period_map[period]) if period in period_map else None

        smm_qs = SMMOrder.objects.exclude(status__in=["pending_payment", "refunded"])
        otp_qs = OTPOrder.objects.exclude(status__in=["pending_payment", "refunded"])
        if start:
            smm_qs = smm_qs.filter(created_at__gte=start)
            otp_qs = otp_qs.filter(created_at__gte=start)

        smm_revenue = smm_qs.aggregate(t=Sum("sell_price"))["t"] or Decimal("0")
        otp_revenue = otp_qs.aggregate(t=Sum("sell_price"))["t"] or Decimal("0")
        total_revenue = smm_revenue + otp_revenue
        total_orders = smm_qs.count() + otp_qs.count()
        avg_order_value = total_revenue / total_orders if total_orders else Decimal("0")

        smm_daily = {
            str(r["date"]): float(r["revenue"] or 0)
            for r in smm_qs.annotate(date=TruncDate("created_at"))
            .values("date").annotate(revenue=Sum("sell_price")).order_by("date")
        }
        otp_daily = {
            str(r["date"]): float(r["revenue"] or 0)
            for r in otp_qs.annotate(date=TruncDate("created_at"))
            .values("date").annotate(revenue=Sum("sell_price")).order_by("date")
        }
        all_dates = sorted(set(list(smm_daily) + list(otp_daily)))
        daily = [{"date": d, "smm": smm_daily.get(d, 0), "otp": otp_daily.get(d, 0)} for d in all_dates]

        top_smm = list(
            smm_qs.values("service__name")
            .annotate(orders=Count("id"), revenue=Sum("sell_price"))
            .order_by("-revenue")[:5]
        )
        top_otp = list(
            otp_qs.values("platform", "country_code")
            .annotate(orders=Count("id"), revenue=Sum("sell_price"))
            .order_by("-revenue")[:5]
        )
        top_services = (
            [{"name": r["service__name"], "orders": r["orders"], "revenue": f"${float(r['revenue']):.2f}"} for r in top_smm] +
            [{"name": f"{r['platform']} OTP ({r['country_code']})", "orders": r["orders"], "revenue": f"${float(r['revenue']):.2f}"} for r in top_otp]
        )
        top_services.sort(key=lambda x: float(x["revenue"].replace("$", "")), reverse=True)

        return Response({
            "period": period,
            "stats": {
                "total_revenue": f"{total_revenue:.2f}",
                "total_orders": total_orders,
                "avg_order_value": f"{avg_order_value:.2f}",
                "smm_revenue": f"{smm_revenue:.2f}",
                "otp_revenue": f"{otp_revenue:.2f}",
            },
            "daily": daily,
            "top_services": top_services[:5],
        })


class AdminSettingsView(APIView):
    """GET/POST /api/admin/settings/"""

    permission_classes = [IsAuthenticated]

    _FIELDS = [
        "smmfollowers_api_key", "smspool_api_key", "fivesim_api_key",
        "cryptomus_merchant_id", "cryptomus_payment_key",
        "notchpay_public_key", "notchpay_secret_key",
    ]

    def get(self, request):
        db = SiteSettings.get()

        def key_set(field):
            db_val = getattr(db, field, "")
            env_val = getattr(django_settings, field.upper(), "")
            return bool(db_val or env_val)

        return Response({f: key_set(f) for f in self._FIELDS})

    def post(self, request):
        serializer = AdminSettingsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        db = SiteSettings.get()
        for field, value in serializer.validated_data.items():
            if value:
                setattr(db, field, value)
        db.save()

        return Response({"detail": "Settings updated."})
