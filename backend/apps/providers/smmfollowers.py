"""SMMFollowers API client for buying SMM services wholesale."""

import requests
from django.conf import settings

STATUS_MAP = {
    "Pending": "processing",
    "In progress": "in_progress",
    "Completed": "completed",
    "Partial": "completed",
    "Cancelled": "failed",
}


def _post(payload: dict) -> dict:
    payload = {"key": settings.SMMFOLLOWERS_API_KEY, **payload}
    response = requests.post(settings.SMMFOLLOWERS_API_URL, data=payload, timeout=30)
    response.raise_for_status()
    return response.json()


def get_services() -> list:
    return _post({"action": "services"})


def place_order(service_id: str, link: str, quantity: int) -> dict:
    return _post({"action": "add", "service": service_id, "link": link, "quantity": quantity})


def check_status(provider_order_id: str) -> dict:
    return _post({"action": "status", "order": provider_order_id})
