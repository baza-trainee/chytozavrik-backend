from rest_framework.routers import DefaultRouter
from django.urls import path
from . import views

app_name = 'user_profile'

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
urlpatterns = [
    path('users/me/', views.MeAPIView.as_view(), name='me'),
    path('avatars/', views.ChildAvatarAPIView.as_view(), name='avatars'),
    path('users/me/children/', views.ChildListCreateAPIView.as_view(), name='children'),
    path('users/me/children/<int:pk>/', views.ChildRetrieveDestroyAPIView.as_view(), name='child'),
]
urlpatterns += router.urls
