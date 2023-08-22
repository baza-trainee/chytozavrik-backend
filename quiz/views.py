from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import mixins
from rest_framework import permissions
from rest_framework.exceptions import MethodNotAllowed
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from .models import Book, RecommendationBook, Quiz, QuizReward
from . import serializers
from .pagination import ResultsSetPagination
from user_profile.swagger_serializers import create_custom_response_serializer

PAGE_PARAMETER = openapi.Parameter('page', openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER)
PAGE_SIZE_PARAMETER = openapi.Parameter('page_size', openapi.IN_QUERY, description="Number of items per page",
                                        type=openapi.TYPE_INTEGER)
BOOK_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.BookSerializer)()
RECOMMENDATION_BOOK_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.BookSerializer)()
CREATE_QUIZ_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizCreateSerializer)()
INFO_QUIZ_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizInfoSerializer)()
QUIZ_REWARD_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizRewardSerializer)()
LIST_QUIZ_REWARD_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizRewardSerializer, True)()

class BookViewSet(ModelViewSet):
    pagination_class = ResultsSetPagination
    queryset = Book.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = permissions.IsAdminUser,

    @swagger_auto_schema(manual_parameters=[
        PAGE_PARAMETER,
        PAGE_SIZE_PARAMETER,
    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: BOOK_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return serializers.BookPatchSerializer
        return serializers.BookSerializer


class RecommendationBookViewSet(mixins.CreateModelMixin,
                                 mixins.DestroyModelMixin,
                                 mixins.ListModelMixin,
                                 GenericViewSet):

    pagination_class = ResultsSetPagination

    @swagger_auto_schema( manual_parameters=[
        PAGE_PARAMETER,
        PAGE_SIZE_PARAMETER,
    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: RECOMMENDATION_BOOK_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        if self.action == 'list':
            return Book.objects.filter(recommendations__isnull=False).distinct()
        return RecommendationBook.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.RecommendationBookSerializer
        return serializers.RecommendationBookCreateSerializer

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


class QuizViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):

    pagination_class = ResultsSetPagination

    @swagger_auto_schema(manual_parameters=[
        PAGE_PARAMETER,
        PAGE_SIZE_PARAMETER,
    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: CREATE_QUIZ_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: INFO_QUIZ_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.action == 'list':
            return Book.objects.filter(quiz__isnull=False)
        elif self.action == 'retrieve':
            Quiz.objects.all().prefetch_related('questions__answers')
        return Quiz.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.QuizSerializer
        elif self.action == 'retrieve':
            return serializers.QuizInfoSerializer
        return serializers.QuizCreateSerializer


class QuizRewardViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = serializers.QuizRewardSerializer
    queryset = QuizReward.objects.all()
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(responses={200: LIST_QUIZ_REWARD_SWAGGER_SERIALIZER})
    def list(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
