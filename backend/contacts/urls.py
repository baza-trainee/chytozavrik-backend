from django.urls import path
from . import views

urlpatterns = [
    path("contact-info/", views.ContactAPIView.as_view(), name="contact-info")
]
