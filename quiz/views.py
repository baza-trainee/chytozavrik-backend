from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ModelViewSet
from .models import Book
from .serializers import BookSerializers, BookPatchSerializer


class BookViewSet(ModelViewSet):
    serializer_class = BookPatchSerializer
    queryset = Book.objects.all()
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        if self.action == 'partial_update':  # This corresponds to the PATCH method
            return BookPatchSerializer
        return BookSerializers