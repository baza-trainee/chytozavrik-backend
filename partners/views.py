from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import filters, status
from rest_framework.response import Response
from django.core.cache import cache, caches

from chytozavrik.helpers import ResultsSetPagination
from .models import Partner
from .serializers import PartnerPatchSerializer, PartnerSerializer
from chytozavrik.settings.base import TIME_HALF_DAY


class PartnerViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]
    queryset = Partner.objects.order_by("id")
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = ResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    partner_cache = caches["partner_cache"]

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            return [AllowAny()]
        return [IsAdminUser()]

    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get("search", None)
        if search_query:
            cache_key = f"partner_search_{search_query}"
            cached_data = self.partner_cache.get(cache_key)
        else:
            cache_key = "partner_list"
            cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            if cache_key.startswith("partner_search_"):
                self.partner_cache.set(cache_key, response.data, TIME_HALF_DAY)
            else:
                cache.set(cache_key, response.data, TIME_HALF_DAY)
        return response

    def retrieve(self, request, *args, **kwargs):
        cache_key = f'partner_{kwargs["pk"]}'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        response = super().retrieve(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            cache.set(cache_key, response.data, TIME_HALF_DAY)
        return response

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
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            cache.delete("partner_list")
            self.partner_cache.clear()

        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            cache.delete_many(["partner_list", f'partner_{kwargs["pk"]}'])
            self.partner_cache.clear()
        return response

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            cache.delete_many(["partner_list", f'partner_{kwargs["pk"]}'])
            self.partner_cache.clear()
        return response

    def get_serializer_class(self):
        if self.action == "partial_update":
            return PartnerPatchSerializer
        return PartnerSerializer
