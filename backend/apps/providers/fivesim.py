"""5sim API client (fallback OTP provider). Docs: https://5sim.net/docs"""

import requests
from django.conf import settings

BASE_URL = "https://5sim.net/v1"


def _headers() -> dict:
    return {"Authorization": f"Bearer {settings.FIVESIM_API_KEY}"}


def get_prices(country: str, product: str) -> dict:
    response = requests.get(
        f"{BASE_URL}/guest/prices",
        params={"country": country, "product": product},
        headers=_headers(),
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def buy_number(country: str, operator: str, product: str) -> dict:
    response = requests.get(
        f"{BASE_URL}/user/buy/activation/{country}/{operator}/{product}",
        headers=_headers(),
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def check_sms(order_id: str) -> dict:
    response = requests.get(
        f"{BASE_URL}/user/check/{order_id}",
        headers=_headers(),
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def cancel_number(order_id: str) -> dict:
    response = requests.get(
        f"{BASE_URL}/user/cancel/{order_id}",
        headers=_headers(),
        timeout=15,
    )
    response.raise_for_status()
    return response.json()
