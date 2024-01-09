from rest_framework import serializers
from django.core.validators import FileExtensionValidator

from chytozavrik.settings.base import IMAGE_FORMATS
from .models import Partner


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = "__all__"


class PartnerPatchSerializer(PartnerSerializer):
    name = serializers.CharField(required=False)
    img = serializers.FileField(
        validators=[FileExtensionValidator(allowed_extensions=IMAGE_FORMATS)]
    )
    link = serializers.URLField(required=False)
