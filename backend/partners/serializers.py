from rest_framework import serializers
from django.core.validators import FileExtensionValidator, MaxLengthValidator

from chytozavrik.settings.base import BASE_URL, FILE_SIZE, IMAGE_FORMATS
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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        file = representation.get("img", None)
        representation["img"] = f"{BASE_URL}/{('/').join(file.split('/')[-3:])}"
        return representation

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
