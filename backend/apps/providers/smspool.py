"""SMSPool API client (primary OTP provider).

Docs: https://www.smspool.net/article/how-to-use-the-smspool-api
Status codes: 1 = waiting, 2 = expired, 3 = received, 4 = used
"""

import requests
from django.conf import settings

BASE_URL = "https://api.smspool.net"


def get_countries() -> dict:
    response = requests.get(
        f"{BASE_URL}/country/retrieve_all",
        params={"key": settings.SMSPOOL_API_KEY},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def buy_number(platform: str, country_code: str) -> dict:
    response = requests.get(
        f"{BASE_URL}/purchase/sms",
        params={"key": settings.SMSPOOL_API_KEY, "country": country_code, "service": platform},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def check_sms(order_id: str) -> dict:
    response = requests.get(
        f"{BASE_URL}/sms/check",
        params={"key": settings.SMSPOOL_API_KEY, "orderid": order_id},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def cancel_number(order_id: str) -> dict:
    response = requests.get(
        f"{BASE_URL}/sms/cancel",
        params={"key": settings.SMSPOOL_API_KEY, "orderid": order_id},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()
