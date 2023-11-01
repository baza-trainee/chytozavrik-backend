from rest_framework import serializers
from .models import Contact
from datetime import date


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"

    current_date = serializers.DateField(default=serializers.CreateOnlyDefault(date.today))

