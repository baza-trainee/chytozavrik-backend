import re

from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from django.core.exceptions import ValidationError


class CustomPasswordTemplateValidator:
    message = ("Пароль повинен містити мінімум 1 спецсимвол (#$%^&+=!?), 1 цифру та 1 велику літеру."\
    +" Усі літери повинні бути латиницею.")

    def validate(self, password, user=None):
        regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!?]*$"
        if not re.search(regex, password):
            raise ValidationError({"password" : self.message})

    def get_help_text(self):
        return self.message


class CustomPasswordEqLoginValidator:
    message = "Пароль не повинен бути схожий на логін."

    def validate(self, password, user=None):
        if user:
            if user.email.split("@")[0].lower() in password.lower():
                raise ValidationError(self.message)

    def get_help_text(self):
        return self.message


class CustomPasswordLenValidator:
    message = "Довжина пароля повинна бути мінімум 8 та максимум 64 символи."

    def validate(self, password, user=None):
        pass_len = len(password)
        if not 8 <= pass_len <= 64:
            raise ValidationError(self.message)

    def get_help_text(self):
        return self.message


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
