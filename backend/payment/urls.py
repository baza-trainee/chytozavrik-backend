from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "payment"

router = DefaultRouter()
router.register(r"pay", views.PaymentViewSet, basename="payment")

urlpatterns = [
    path(
        "pay/approve/",
        views.ApproveViewSet.as_view({"post": "approve"}),
        name="approve_pay",
    ),
]
urlpatterns += router.urls
