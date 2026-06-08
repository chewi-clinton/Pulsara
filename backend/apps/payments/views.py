from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from . import cryptomus, flutterwave


class CryptomusWebhookView(APIView):
    """POST /api/webhooks/cryptomus/ — verify MD5 signature, mark order paid, trigger fulfilment."""

    permission_classes = [AllowAny]

    def post(self, request):
        if not cryptomus.verify_webhook(dict(request.data)):
            return Response({"detail": "invalid signature"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


class FlutterwaveWebhookView(APIView):
    """POST /api/webhooks/flutterwave/ — verify verif-hash header, mark order paid, trigger fulfilment."""

    permission_classes = [AllowAny]

    def post(self, request):
        if not flutterwave.verify_webhook(request.headers):
            return Response({"detail": "invalid hash"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
