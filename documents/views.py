from django.http import HttpResponse
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from drf_yasg.utils import swagger_auto_schema
from django.core.cache import cache

from chytozavrik.settings import base
from chytozavrik.settings.base import TIME_HALF_DAY
from .models import Document
from .serializers import DocumentSerializer


@swagger_auto_schema(manual_fields=[])
class DocumentLinkViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    schema = None

    @action(detail=False, methods=["get"])
    def get_document(self, request, document_slug):
        document_ids = {
            "privacy-policy": 1,
            "site-rules": 2,
        }
        try:
            document = self.get_cached_document(document_slug)
            if not document:
                document = Document.objects.get(id=document_ids[document_slug])
                self.cache_document(document_slug, document)

            response = HttpResponse(document.file, content_type="application/pdf")
            response["Content-Disposition"] = f'inline; filename="{document_slug}.pdf"'
            return response
        except Document.DoesNotExist:
            return Response(
                {"detail": "Файл не знайдено."}, status=status.HTTP_404_NOT_FOUND
            )

    def get_cached_document(self, document_slug):
        document_cache_key = f"document_{document_slug}"
        return cache.get(document_cache_key)

    def cache_document(self, document_slug, document):
        document_cache_key = f"document_{document_slug}"
        cache.set(document_cache_key, document, timeout=TIME_HALF_DAY)


class DocumentViewSet(
    mixins.UpdateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
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
        cached_data = cache.get(base.DOCUMENTS_CACHE_NAME)
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        queryset = self.get_queryset()
        serialized_data = self.get_serializer(queryset, many=True).data

        for item in serialized_data:
            item["file"] = self.get_file_url(item["id"])

        cache.set(
            base.DOCUMENTS_CACHE_NAME, {"data": serialized_data}, timeout=TIME_HALF_DAY
        )

        return Response({"data": serialized_data}, status=status.HTTP_200_OK)

    def get_file_url(self, document_id):
        if document_id == 1:
            endpoint = "privacy-policy.pdf"
        else:
            endpoint = "site-rules.pdf"

        request = self.request
        absolute_url = request.build_absolute_uri(endpoint)
        return absolute_url

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_file = request.data.get("file")

        if new_file:
            if not new_file.name.endswith(".pdf"):
                return Response(
                    {"detail": "Файл повинен бути у форматі '.pdf'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            new_file_binary = new_file.read()
            if len(new_file_binary) > 30 * 1024**2:
                return Response(
                    {"detail": "Розмір файлу не повинен перевищувати 30 мегабайт."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            document_slug = (
                "privacy-policy" if kwargs.get("pk") == "1" else "site-rules"
            )

            if instance.file:
                instance.file = new_file_binary
                instance.save()

                cache.delete(f"document_{document_slug}")
                cache.delete(base.DOCUMENTS_CACHE_NAME)

            updated_object = self.get_object()
            serialized_object = self.serializer_class(updated_object).data

            file_url = self.get_file_url(instance.id).split("/")
            file_url = "/".join((file_url[:-2] + file_url[-1:]))
            serialized_object["file"] = file_url

            return Response({"data": serialized_object}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Не надано документу для оновлення."},
                status=status.HTTP_400_BAD_REQUEST,
            )
