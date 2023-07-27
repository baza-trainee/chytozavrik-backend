from rest_framework.viewsets import GenericViewSet
from drf_yasg.utils import swagger_auto_schema
from .serializers import UserSerializer
from .swagger_serializers import UserSwaggerPostSerializer, UserSwaggerGetSerializer
from rest_framework import generics, permissions, mixins
from .models import User


class UserViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
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
