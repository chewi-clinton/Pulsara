"""Flutterwave payment client. Docs: https://developer.flutterwave.com"""

import requests
from django.conf import settings

API_URL = "https://api.flutterwave.com/v3/payments"


def create_payment(tx_ref: str, amount: str, redirect_url: str, customer_email: str = "") -> dict:
    body = {
        "tx_ref": tx_ref,
        "amount": amount,
        "currency": "USD",
        "redirect_url": redirect_url,
        "customer": {"email": customer_email},
        "customizations": {
            "title": "Nexora",
            "logo": f"{settings.FRONTEND_URL}/logo.png",
        },
    }
    response = requests.post(
        API_URL,
        json=body,
        headers={"Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def verify_webhook(request_headers) -> bool:
    return request_headers.get("verif-hash") == settings.FLUTTERWAVE_WEBHOOK_HASH
