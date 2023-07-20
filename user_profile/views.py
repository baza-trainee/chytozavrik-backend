from .serializers import UserSerializer
from rest_framework import viewsets
from .models import User


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
