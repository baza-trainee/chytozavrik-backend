from rest_framework import serializers
from .models import User


class UserSwaggerPostSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(min_length=6, style={'input_type': 'password'}, write_only=True)
    password = serializers.CharField(min_length=6, style={'input_type': 'password'}, write_only=True)
    email = serializers.EmailField(min_length=3)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}
        ref_name = "UserPostInfo"


class UserSwaggerGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'is_superuser', 'email']
        extra_kwargs = {'password': {'write_only': True}}
        ref_name = "UserInfo"
