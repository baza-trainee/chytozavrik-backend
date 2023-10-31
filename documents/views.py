from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document
from rest_framework import status
from .serializers import DocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class DocumentViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "patch"]
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_file = request.data.get("file")

        if new_file:
            if not new_file.name.endswith(".pdf"):
                return Response(
                    {"detail": "Файл повинен бути у форматі '.pdf'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            old_filename = instance.file.name.split("/")[-1]

            if instance.file:
                instance.file.delete()

            instance.file.save(old_filename, new_file, save=True)

            updated_object = self.get_object()
            serialized_object = self.serializer_class(updated_object)

            return Response(serialized_object.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Не знайдено документу для оновлення."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["get"], url_path="privacy-policy")
    def get_privacy_policy(self, request):
        try:
            document = Document.objects.get(id=1)
            serializer = DocumentSerializer(document)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response(
                {"detail": "Файл не знайдено."}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"], url_path="site-rules")
    def get_site_rules(self, request):
        try:
            document = Document.objects.get(id=2)
            serializer = DocumentSerializer(document)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response(
                {"detail": "Файл не знайдено."}, status=status.HTTP_404_NOT_FOUND
            )
