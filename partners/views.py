from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import filters, status
from rest_framework.response import Response

from .models import Partner
from .serializers import PartnerPatchSerializer, PartnerSerializer
from .pagination import PartnerPagination


class PartnerViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]
    queryset = Partner.objects.order_by("id")
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = PartnerPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            return [AllowAny()]
        return [IsAdminUser()]

    def create(self, request, *args, **kwargs):
        data = request.data
        data["name"] = data["name"].strip()
        data["link"] = data["link"].strip()
        existing_partner = Partner.objects.filter(
            name__iexact=data["name"], link__iexact=data["link"]
        ).exists()
        if existing_partner:
            return Response(
                {"detail": f"Партнер '{data['name']}' вже існує в базі даних."},
                status=status.HTTP_409_CONFLICT,
            )
        return super().create(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == "partial_update":
            return PartnerPatchSerializer
        return PartnerSerializer
