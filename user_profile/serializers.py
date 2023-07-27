from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'is_superuser', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 6},
            'email': {'min_length': 3}
        }

    def validate(self, data):
        password = data.get('password')
        password2 = data.pop('password2')

        if password != password2:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if len(password) < 6:
            raise serializers.ValidationError({"password": "Password must be at least 6 characters long."})

        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({"password": "Password must contain at least one digit."})

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
        )

        return user
