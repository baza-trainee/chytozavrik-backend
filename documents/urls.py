from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

app_name = "documents"

router = DefaultRouter()
router.register(r"documents", views.DocumentViewSet, basename="document")
urlpatterns = [
]

urlpatterns += router.urls
