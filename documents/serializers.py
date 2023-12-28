from rest_framework import serializers
from django.core.validators import FileExtensionValidator

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(
        required=False,
        validators=[
            FileExtensionValidator(allowed_extensions=["pdf"]),
        ],
    )

    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["name"]
