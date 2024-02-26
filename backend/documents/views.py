from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache

from chytozavrik.settings.base import TIME_HALF_DAY
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

    def list(self, request):
        cached_data = cache.get("document_list_cache")
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        queryset = self.get_queryset()
        serialized_data = self.get_serializer(queryset, many=True).data

        cache.set(
            "document_list_cache", {"data": serialized_data}, timeout=TIME_HALF_DAY
        )

        return Response({"data": serialized_data}, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        cache_key = f"document_retrieve_cache_{kwargs['pk']}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data

        cache.set(cache_key, {"data": serialized_data}, timeout=TIME_HALF_DAY)

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        file_field = request.data.get("file", None)
        if file_field and file_field.name.endswith(".pdf"):
            file_field.name = file_field.file.name = instance.file.name
            request.data["file"] = file_field
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            instance.file.delete(save=False)
        self.perform_update(serializer)

        cache.delete("document_list_cache")
        cache.delete(f"document_retrieve_cache_{kwargs['pk']}")
        return Response(serializer.data)
