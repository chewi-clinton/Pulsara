"""NotchPay payment client. Docs: https://developer.notchpay.co"""

import hashlib
import hmac
import json

import requests
from django.conf import settings

API_URL = "https://api.notchpay.co/payments"


def create_payment(reference: str, amount: str, callback_url: str, customer_email: str = "") -> dict:
    body = {
        "email": customer_email or "customer@pulsara.app",
        "amount": float(amount),
        "currency": "USD",
        "reference": reference,
        "callback": callback_url,
        "description": "Pulsara Payment",
    }
    response = requests.post(
        API_URL,
        json=body,
        headers={
            "Authorization": settings.NOTCHPAY_PUBLIC_KEY,
            "Content-Type": "application/json",
        },
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def verify_webhook(payload: dict, signature: str) -> bool:
    key = settings.NOTCHPAY_SECRET_KEY.encode()
    msg = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode()
    expected = hmac.new(key, msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature or "")
