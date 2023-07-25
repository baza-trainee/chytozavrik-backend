from rest_framework.viewsets import GenericViewSet

from .serializers import UserSerializer
from rest_framework import generics, permissions, mixins
from .models import User


class UserViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class MeAPIView(generics.RetrieveAPIView):
    """
    A view that allows the logged in user to see their details.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        """
        Return the logged in user
        """
        return self.request.user
