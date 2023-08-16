from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import mixins
from rest_framework import permissions
from .models import Book, RecommendationBook
from . import serializers


class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = permissions.IsAdminUser,

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return serializers.BookPatchSerializer
        return serializers.BookSerializer


class RecommendationBookViewSet(mixins.CreateModelMixin,
                                 mixins.DestroyModelMixin,
                                 mixins.ListModelMixin,
                                 GenericViewSet):

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

