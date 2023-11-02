from rest_framework import serializers
from .models import Partner


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = "__all__"


class PartnerPatchSerializer(PartnerSerializer):
    name = serializers.CharField(required=False)
    img = serializers.ImageField(required=False)
    link = serializers.URLField(required=False)
