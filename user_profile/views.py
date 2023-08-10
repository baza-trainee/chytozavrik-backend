from rest_framework.viewsets import GenericViewSet
from rest_framework import generics, permissions, mixins
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import OR
from .serializers import UserSerializer, ChildAvatarSerializer, ChildSerializer
from .swagger_serializers import UserSwaggerPostSerializer, UserSwaggerGetSerializer, create_custom_response_serializer
from .models import User, ChildAvatar, Child
from .permissions import IsUser, IsParent, IsChildBelongingToParent

LIST_USER_SERIALIZER = create_custom_response_serializer(UserSwaggerGetSerializer, True)()
DETAIL_USER_SERIALIZER = create_custom_response_serializer(UserSwaggerGetSerializer)()
AVATAR_SERIALIZER = create_custom_response_serializer(ChildAvatarSerializer, True)()
LIST_CHILD_SERIALIZER = create_custom_response_serializer(ChildSerializer, True)()
DETAIL_CHILD_SERIALIZER = create_custom_response_serializer(ChildSerializer)()


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
            'destroy': [permissions.IsAdminUser],
            'default': [IsUser | permissions.IsAdminUser],
        }

        permission_classes = permissions_map.get(self.action, permissions_map['default'])

        return [permission() for permission in permission_classes]

    serializer_class = UserSerializer
    queryset = User.objects.all()

    @swagger_auto_schema(responses={'200': LIST_USER_SERIALIZER})
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={'200': DETAIL_USER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request,  *args, **kwargs)

    @swagger_auto_schema(request_body=UserSwaggerPostSerializer, responses={'201': DETAIL_USER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class MeAPIView(generics.RetrieveAPIView):
    """
    A view that allows the logged in user to see their details.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    @swagger_auto_schema(responses={'200': DETAIL_USER_SERIALIZER})
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)

    def get_object(self):
        """
        Return the logged in user
        """
        return self.request.user


class ChildAvatarAPIView(generics.ListAPIView):
    queryset = ChildAvatar.objects.all()
    serializer_class = ChildAvatarSerializer

    @swagger_auto_schema(responses={'200': AVATAR_SERIALIZER})
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ChildListCreateAPIView(ListCreateAPIView):
    serializer_class = ChildSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [OR(IsParent(), permissions.IsAdminUser())]
        elif self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return super().get_permission_classes()

    def get_queryset(self):
        user_pk = self.kwargs.get('user_pk')
        query = Child.objects.filter(parent=user_pk).all()
        return query

    @swagger_auto_schema(responses={'200': LIST_CHILD_SERIALIZER})
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    @swagger_auto_schema(request_body=ChildSerializer, responses={'200': DETAIL_CHILD_SERIALIZER})
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ChildRetrieveDestroyAPIView(RetrieveDestroyAPIView):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer
    permission_classes = [IsChildBelongingToParent, IsParent | permissions.IsAdminUser]

    @swagger_auto_schema(responses={'200': DETAIL_CHILD_SERIALIZER})
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
