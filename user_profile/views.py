import os
import random
import string

from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.db.models import Q
from rest_framework import status
from rest_framework import generics, permissions, mixins, filters
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    UpdateAPIView,
)
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import User, ChildAvatar, Child
from .permissions import IsUser
from .pagination import ResultsSetPagination
from .swagger_serializers import (
    UserSwaggerPostSerializer,
    UserSwaggerGetSerializer,
    create_custom_response_serializer,
)
from .serializers import (
    UserSerializer,
    ChildAvatarSerializer,
    ChildSerializer,
    EmptySerializer,
)


LIST_USER_SERIALIZER = create_custom_response_serializer(
    UserSwaggerGetSerializer, True
)()
DETAIL_USER_SERIALIZER = create_custom_response_serializer(UserSwaggerGetSerializer)()
AVATAR_SERIALIZER = create_custom_response_serializer(ChildAvatarSerializer, True)()
LIST_CHILD_SERIALIZER = create_custom_response_serializer(ChildSerializer, True)()
DETAIL_CHILD_SERIALIZER = create_custom_response_serializer(ChildSerializer)()
DETAIL_CHILD_SERIALIZER = create_custom_response_serializer(ChildSerializer)()

PAGE_PARAMETER = openapi.Parameter(
    "page", openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER
)
PAGE_SIZE_PARAMETER = openapi.Parameter(
    "page_size",
    openapi.IN_QUERY,
    description="Number of items per page",
    type=openapi.TYPE_INTEGER,
)
SEARCH = openapi.Parameter(
    "search",
    openapi.IN_QUERY,
    description="Search users by email",
    type=openapi.TYPE_STRING,
)


def answer_response(user_email):
    return {
        "detail": f"Пароль для {user_email} скинуто! "
        "Користувачу на пошту вiдправлено лист iз новим паролем."
    }


def generate_password(len=8):
    return "".join(random.choices(string.ascii_letters + string.digits, k=len))


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    pagination_class = ResultsSetPagination
    filter_backends = [filters.SearchFilter]
    queryset = User.objects.order_by("id")
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        permissions_map = {
            "list": [permissions.IsAdminUser],
            "create": [permissions.AllowAny],
            "destroy": [permissions.IsAdminUser],
            "default": [IsUser | permissions.IsAdminUser],
        }

        permission_classes = permissions_map.get(
            self.action, permissions_map["default"]
        )

        return [permission() for permission in permission_classes]

    @swagger_auto_schema(
        manual_parameters=[PAGE_PARAMETER, PAGE_SIZE_PARAMETER, SEARCH],
        responses={"200": LIST_USER_SERIALIZER},
    )
    def list(self, request, *args, **kwargs):
        search = request.query_params.get("search", None)
        if search:
            queryset = User.objects.filter(Q(email__icontains=search))
        else:
            queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(responses={"200": DETAIL_USER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=UserSwaggerPostSerializer,
        responses={"201": DETAIL_USER_SERIALIZER},
    )
    def create(self, request, *args, **kwargs):
        data = request.data
        for field in data.keys():
            if field not in ["email", "password", "password2"]:
                return Response({"detail": f"Поле '{field}' не підтримується."}, 400)
        get_email = data.get("email")
        email = get_email.lower()
        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "користувач з таким email вже існує."},
                400,
            )
        return super().create(request, *args, **kwargs)


class GenerateNewPasswordView(UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ["put"]
    serializer_class = EmptySerializer

    def get_queryset(self):
        return User.objects.none()

    @swagger_auto_schema(
        responses={"200": answer_response(user_email="<user_email>").get("detail")}
    )
    def put(self, request, pk):
        if request.data:
            return Response(
                {"detail": "Тіло запиту має бути порожнім."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = get_object_or_404(User, pk=pk)
        new_password = generate_password(12)
        user.set_password(new_password)
        user.save()
        send_mail(
            subject="Зміна паролю на Chitozavrik.ua",
            message=f"Ваш новий пароль: {new_password}",
            from_email=os.getenv("EMAIL_USER"),
            recipient_list=[user.email],
            fail_silently=False,
        )
        return Response(
            answer_response(user_email=user.email),
            status=status.HTTP_200_OK,
        )


class MeAPIView(generics.RetrieveAPIView):
    """
    A view that allows the logged in user to see their details.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    @swagger_auto_schema(responses={"200": DETAIL_USER_SERIALIZER})
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

    @swagger_auto_schema(responses={"200": AVATAR_SERIALIZER})
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ChildListCreateAPIView(ListCreateAPIView):
    serializer_class = ChildSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(parent=user)

    def get_queryset(self):
        return Child.objects.filter(parent=self.request.user.pk)

    @swagger_auto_schema(responses={"200": LIST_CHILD_SERIALIZER})
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=ChildSerializer, responses={"200": DETAIL_CHILD_SERIALIZER}
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ChildRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ChildSerializer
    http_method_names = ["get", "put", "delete"]

    def get_queryset(self):
        return Child.objects.filter(parent=self.request.user.pk)

    @swagger_auto_schema(responses={"200": DETAIL_CHILD_SERIALIZER})
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @swagger_auto_schema(responses={"200": DETAIL_CHILD_SERIALIZER})
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
