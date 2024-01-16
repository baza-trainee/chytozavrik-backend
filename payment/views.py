# Create your views here.
from datetime import datetime, timedelta
import hmac
import hashlib
import uuid
from urllib.parse import urlparse

import requests
from django.shortcuts import redirect
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from chytozavrik.settings.base import MERCHANT_ACCOUNT, MERCHANT_SECRET, SITE_URL


class PaymentViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    http_method_names = ["post"]
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "amount": openapi.Schema(type=openapi.TYPE_NUMBER),
            },
            description="integer or float",
            required=["amount"],
        ),
        responses={
            status.HTTP_200_OK: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "payment_url": openapi.Schema(type=openapi.TYPE_STRING),
                },
                description="Link to the payment page",
            ),
        },
    )
    def create(self, request, *args, **kwargs):
        amount = request.data.get("amount", None)
        if not isinstance(amount, (int, float)) or amount < 1:
            return Response(
                {"detail": f"Сума повинна бути числом зі значенням більше, ніж 1."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_body = {
            "merchantAccount": MERCHANT_ACCOUNT,
            "merchantDomainName": urlparse(SITE_URL).netloc,
            "orderReference": str(uuid.uuid4()),
            "orderDate": str(int((datetime.utcnow() - timedelta(days=1)).timestamp())),
            "amount": str(amount),
            "currency": "UAH",
            "productName": "Chytozavryk support",
            "productCount": "1",
            "productPrice": str(amount),
        }
        signature_data = ";".join(payment_body.values())
        merchant_signature = hmac.new(
            MERCHANT_SECRET.encode("utf-8"), signature_data.encode("utf-8"), hashlib.md5
        ).hexdigest()

        payment_body.update(
            {
                "language": "UA",
                "returnUrl": request.build_absolute_uri("approve"),
                "merchantSignature": merchant_signature,
            }
        )
        response = requests.post(
            url="https://secure.wayforpay.com/pay", data=payment_body
        )
        payment_url = response.request.url
        if not payment_url:
            return Response(
                {"detail": f"Немає відповіді від платіжної системи."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"payment_url": payment_url})


class ApproveViewSet(viewsets.ViewSet):
    schema = None
    permission_classes = [AllowAny]

    def approve(self, request, *args, **kwargs):
        return redirect(f"{SITE_URL}/?payment=success")
