from celery import shared_task


@shared_task
def sync_smm_services():
    """Job 1 — fetch services from SMMFollowers, upsert SMMService rows, deactivate removed ones."""


@shared_task
def sync_otp_services():
    """Job 2 — fetch available services/prices from SMSPool and 5sim, upsert OTPService rows."""
