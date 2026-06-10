import logging
from datetime import datetime, timezone

from celery import shared_task

log = logging.getLogger(__name__)


@shared_task
def sync_smm_services():
    """Fetch services from SMMFollowers, upsert SMMService rows, deactivate removed ones."""
    from apps.providers import smmfollowers
    from .models import SMMService

    try:
        services = smmfollowers.get_services()
    except Exception as exc:
        log.error("sync_smm_services: provider call failed: %s", exc)
        return

    now = datetime.now(tz=timezone.utc)
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

    log.info("sync_smm_services: upserted %d, deactivated %d", len(fetched_ids), len(gone))


@shared_task
def sync_otp_services():
    """OTP prices are fetched per-order via otp_router. This is a no-op placeholder."""
    log.info("sync_otp_services: prices fetched at order time — skipped")


def _guess_platform(name: str) -> str:
    n = name.lower()
    for p in ("instagram", "tiktok", "youtube", "twitter", "facebook", "telegram", "whatsapp", "google"):
        if p in n:
            return p
    return "instagram"


def _guess_category(name: str) -> str:
    n = name.lower()
    for c in ("followers", "likes", "views", "comments", "shares"):
        if c in n:
            return c
    return "followers"
