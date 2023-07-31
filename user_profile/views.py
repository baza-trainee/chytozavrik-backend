from rest_framework.viewsets import GenericViewSet
from rest_framework import generics, permissions, mixins
from drf_yasg.utils import swagger_auto_schema
from .serializers import UserSerializer
from .swagger_serializers import UserSwaggerPostSerializer, UserSwaggerGetSerializer
from .models import User
from .permissions import IsUser


class UserViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """

        permissions_map = {
            'list': [permissions.IsAdminUser],
            'create': [permissions.AllowAny],
            'destroy': [IsUser],
            'default': [IsUser | permissions.IsAdminUser],
        }

        permission_classes = permissions_map.get(self.action, permissions_map['default'])

        return [permission() for permission in permission_classes]

    serializer_class = UserSerializer
    queryset = User.objects.all()

    @swagger_auto_schema(responses={'200': UserSwaggerGetSerializer(many=True)})
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(request_body=UserSwaggerPostSerializer, responses={'201': UserSwaggerGetSerializer()})
    def create(self, request, *args, **kwargs):

        return super().create(request, *args, **kwargs)


class MeAPIView(generics.RetrieveAPIView):
    """
    A view that allows the logged in user to see their details.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    @swagger_auto_schema(responses={'200': UserSwaggerGetSerializer()})
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)

    def get_object(self):
        """
        Return the logged in user
        """
        return self.request.user
