from celery import shared_task


@shared_task
def expire_otp_sessions():
    """Job 3 — mark waiting_sms OTP orders past expires_at as expired and trigger refunds."""


@shared_task
def poll_otp_status():
    """Job 4 — poll SMSPool/5sim for incoming SMS on active OTP orders, store otp_code."""


@shared_task
def poll_smm_order_status():
    """Job 5 — poll SMMFollowers for status on processing/in_progress SMM orders."""


@shared_task
def process_refund(order_type: str, order_id: int):
    """Job 6 — mark payment as refunded and log the refund event."""
