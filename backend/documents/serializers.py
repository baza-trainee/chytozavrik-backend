from rest_framework import serializers
from django.core.validators import FileExtensionValidator, MaxLengthValidator

from chytozavrik.settings.base import BASE_URL, FILE_SIZE
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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        file = representation.get("file", None)
        representation["file"] = f"{BASE_URL}/{('/').join(file.split('/')[-3:])}"
        return representation

    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["name"]
