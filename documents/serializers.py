from rest_framework import serializers
from django.core.validators import FileExtensionValidator, MaxLengthValidator

from chytozavrik.settings.base import FILE_SIZE
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(
        required=False,
        validators=[
            FileExtensionValidator(allowed_extensions=["pdf"]),
            MaxLengthValidator(
                limit_value=FILE_SIZE,
                message=f"Розмір файлу не повинен перевищувати {FILE_SIZE / 1024 / 1024} MB",
            ),
        ],
    )

    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["name"]
