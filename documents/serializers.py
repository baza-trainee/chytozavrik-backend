from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)

    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["name"]
