"""CryptoMus payment client. Docs: https://doc.cryptomus.com/payments"""

import base64
import hashlib
import json

import requests
from django.conf import settings

API_URL = "https://api.cryptomus.com/v1/payment"


def create_payment(order_id: str, amount: str, return_url: str) -> dict:
    body = {
        "amount": amount,
        "currency": "USD",
        "order_id": order_id,
        "url_callback": f"{settings.FRONTEND_URL}/api/webhooks/cryptomus/",
        "url_return": return_url,
        "lifetime": 1800,
    }
    json_str = json.dumps(body, separators=(",", ":"))
    sign = hashlib.md5(
        (base64.b64encode(json_str.encode()).decode() + settings.CRYPTOMUS_PAYMENT_KEY).encode()
    ).hexdigest()
    response = requests.post(
        API_URL,
        json=body,
        headers={"merchant": settings.CRYPTOMUS_MERCHANT_ID, "sign": sign},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def verify_webhook(payload: dict) -> bool:
    payload = dict(payload)
    sign = payload.pop("sign", None)
    json_str = json.dumps(payload, separators=(",", ":"))
    expected = hashlib.md5(
        (base64.b64encode(json_str.encode()).decode() + settings.CRYPTOMUS_PAYMENT_KEY).encode()
    ).hexdigest()
    return sign == expected
