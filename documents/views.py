from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(ModelViewSet, GenericViewSet):
    http_method_names = ["get", "patch"]
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        permission_classes = {
            "GET": [AllowAny()],
            "PATCH": [IsAdminUser()],
        }
        return permission_classes.get(self.request.method, [])
