from . import views
from rest_framework.routers import DefaultRouter

app_name = "partners"

router = DefaultRouter()
router.register(r"partners", views.PartnerViewSet, basename="partner")
urlpatterns = []
urlpatterns += router.urls
