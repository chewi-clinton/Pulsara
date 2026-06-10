import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("pulsara")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "sync-smm-services": {
        "task": "apps.services.tasks.sync_smm_services",
        "schedule": crontab(minute=0, hour="*/6"),
    },
    "sync-otp-services": {
        "task": "apps.services.tasks.sync_otp_services",
        "schedule": crontab(minute=0, hour="*/6"),
    },
    "expire-otp-sessions": {
        "task": "apps.orders.tasks.expire_otp_sessions",
        "schedule": crontab(minute="*"),
    },
    "poll-otp-status": {
        "task": "apps.orders.tasks.poll_otp_status",
        "schedule": 5.0,
    },
    "poll-smm-order-status": {
        "task": "apps.orders.tasks.poll_smm_order_status",
        "schedule": crontab(minute="*/2"),
    },
}
