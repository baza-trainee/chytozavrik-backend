from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound


class ResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        page_size = request.query_params.get("page_size", None)
        page = request.query_params.get("page", None)
        if page and int(page) <= 0:
            raise NotFound("page повинен бути цілим, додатнім числом.")
        if page_size and int(page_size) <= 0:
            raise NotFound("page_size повинен бути цілим, додатнім числом.")
        return super().paginate_queryset(queryset, request, view)
