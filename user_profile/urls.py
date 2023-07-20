from rest_framework.routers import DefaultRouter
from . import views

app_name = 'user_profile'

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
urlpatterns = []
urlpatterns += router.urls
