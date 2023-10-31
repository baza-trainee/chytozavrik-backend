"""
URL configuration for chytozavrik project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .yasg import urlpatterns as doc_urls
from .views import MyTokenObtainPairView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("user_profile.urls")),
    path("api/v1/", include("quiz.urls")),
    path("api/v1/", include("contacts.urls")),
    path("api/v1/", include("partners.urls")),
    path(
        "api/v1/auth/token/",
        include(
            [
                path("", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
                path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
            ]
        ),
    ),
]

urlpatterns += doc_urls

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
