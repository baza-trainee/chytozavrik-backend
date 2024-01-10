from rest_framework.routers import DefaultRouter

from . import views

app_name = "payment"

router = DefaultRouter()
router.register(r"pay", views.PaymentViewSet, basename="payment")

urlpatterns = []
urlpatterns += router.urls
