from rest_framework import serializers
from django.core.validators import FileExtensionValidator, MaxLengthValidator

from chytozavrik.settings.base import FILE_SIZE, IMAGE_FORMATS
from .models import Partner


class PartnerSerializer(serializers.ModelSerializer):
    img = serializers.FileField(
        required=True,
        validators=[
            FileExtensionValidator(allowed_extensions=IMAGE_FORMATS),
            MaxLengthValidator(
                limit_value=FILE_SIZE,
                message=f"Розмір файлу не повинен перевищувати {FILE_SIZE / 1024 / 1024} MB",
            ),
        ],
    )

    class Meta:
        model = Partner
        fields = "__all__"


class PartnerPatchSerializer(PartnerSerializer):
    name = serializers.CharField(required=False)
    img = serializers.FileField(
        required=False,
        validators=[
            FileExtensionValidator(allowed_extensions=IMAGE_FORMATS),
            MaxLengthValidator(
                limit_value=FILE_SIZE,
                message=f"Розмір файлу не повинен перевищувати {FILE_SIZE / 1024 / 1024} MB",
            ),
        ],
    )
    link = serializers.URLField(required=False)
