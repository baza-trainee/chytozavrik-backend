from rest_framework.routers import DefaultRouter
from django.urls import path

from . import views

app_name = "user_profile"

router = DefaultRouter()
router.register(r"users", views.UserViewSet, basename="user")
urlpatterns = [
    path("users/me/", views.MeAPIView.as_view(), name="me"),
    path("avatars/", views.ChildAvatarAPIView.as_view(), name="avatars"),
    path("users/me/children/", views.ChildListCreateAPIView.as_view(), name="children"),
    path(
        "users/me/children/<int:pk>/",
        views.ChildRetrieveUpdateDestroyAPIView.as_view(),
        name="child",
    ),
    path(
        "users/password/reset/",
        views.CustomPasswordResetView.as_view(),
        name="rest_password_reset",
    ),
    path(
        "users/password/reset/confirm/",
        views.CustomPasswordResetConfirmView.as_view(),
        name="rest_password_reset_confirm",
    ),
    path(
        "users/password/change/",
        views.CustomPasswordChangeView.as_view(),
        name="rest_password_change",
    ),
]
urlpatterns += router.urls
