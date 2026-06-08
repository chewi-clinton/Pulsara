"""Provider fallback logic: try SMSPool first, fall back to 5sim."""

import logging

from . import fivesim, smspool

log = logging.getLogger(__name__)


def get_otp_number(platform: str, country: str) -> dict:
    try:
        result = smspool.buy_number(platform, country)
        if result.get("success"):
            return {"provider": "smspool", "data": result}
    except Exception as e:
        log.warning("SMSPool failed: %s", e)

    try:
        result = fivesim.buy_number(country, "any", platform)
        return {"provider": "5sim", "data": result}
    except Exception:
        raise Exception("No numbers available from any provider")
