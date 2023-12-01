from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from dj_rest_auth.serializers import (
    PasswordResetConfirmSerializer
)
from cloudinary import CloudinaryResource
from django.utils import timezone
from django.db.models import Count
from django.utils.encoding import force_str
from django.contrib.auth import get_user_model

from .models import User, ChildAvatar, Child


class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    def validate(self, attrs):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode as uid_decoder

        # Get the UserModel
        UserModel = get_user_model()
        # Decode the uidb64 (allauth use base36) to uid to get User object
        try:
            uid = force_str(uid_decoder(attrs["uid"]))
            self.user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            raise ValidationError({"uid": "Некоректне значення"})

        if not default_token_generator.check_token(self.user, attrs["token"]):
            raise ValidationError({"token": "Некоректне значення"})

        self.custom_validation(attrs)
        # Construct SetPasswordForm instance
        self.set_password_form = self.set_password_form_class(
            user=self.user,
            data=attrs,
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)

        return attrs


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={"input_type": "password"}, write_only=True, min_length=8
    )

    class Meta:
        model = User
        fields = ["id", "email", "is_superuser", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 8},
            "email": {"min_length": 3},
            "is_superuser": {"read_only": True},
        }

    def validate(self, data):
        password = data.get("password")
        password2 = data.pop("password2")

        if password != password2:
            raise serializers.ValidationError({"password": "Паролі не співпадають."})

        if len(password) < 6:
            raise serializers.ValidationError(
                {"password": "Пароль повинен містити принаймні 8 символів."}
            )

        if len(password) > 30:
            raise serializers.ValidationError(
                "Пароль не може бути довшим за 30 символів."
            )

        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError(
                {"password": "Пароль повинен містити принаймні одну цифру."}
            )

        if not any(char.isalpha() for char in password):
            raise serializers.ValidationError(
                {"password": "Пароль повинен містити принаймні одну літеру."}
            )

        if any(char.isalpha() and not char.isascii() for char in password):
            raise serializers.ValidationError(
                {"password": "Пароль повинен містити лише латинські символи."}
            )

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user


class ChildAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildAvatar
        fields = "__all__"


class ChildSerializer(serializers.ModelSerializer):
    unique_quizzes_passed = serializers.SerializerMethodField()
    total_successful_attempts = serializers.SerializerMethodField()
    last_quiz_id = serializers.SerializerMethodField()
    quizzes_passed_today_max_score = serializers.SerializerMethodField()
    avatar_as_url = serializers.SerializerMethodField()

    def get_avatar_as_url(self, obj):
        avatar = str(obj.avatar.avatar)
        media_url = self.context['request'].build_absolute_uri('/media/')
        media_url += avatar
        # cloudinary_url = CloudinaryResource(avatar, resource_type="raw").build_url()
        return media_url
    
    def validate(self, attrs):
        user = self.context["request"].user
        children_count = Child.objects.filter(parent=user).count()
        if children_count >= 6:
            raise serializers.ValidationError(
                {"detail": "Не можна додати більше ніж 6 дітей."}
            )
        return attrs

    def get_total_successful_attempts(self, obj):
        attempts = obj.childquizattempt_set.all()
        total_successful_attempts = sum(attempt.total_attempts for attempt in attempts)
        return total_successful_attempts

    def get_unique_quizzes_passed(self, obj):
        attempts = obj.childquizattempt_set.filter(total_attempts__gte=1)
        return attempts.count()

    def get_last_quiz_id(self, obj):
        attempts = obj.childquizattempt_set.all()
        if attempts:
            last_attempt = max(attempts, key=lambda x: x.last_attempt_date)
            return last_attempt.quiz.id
        return None

    def get_quizzes_passed_today_max_score(self, obj):
        today = timezone.now().date()
        attempts = obj.childquizattempt_set.filter(
            last_attempt_date__date=today, score=Count("quiz__questions")
        )
        return attempts.count()

    class Meta:
        model = Child
        fields = [
            "id",
            "name",
            "registration_date",
            "avatar",
            "avatar_as_url",
            "unique_quizzes_passed",
            "total_successful_attempts",
            "last_quiz_id",
            "quizzes_passed_today_max_score",
        ]


class PatchChildSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    avatar = serializers.PrimaryKeyRelatedField(
        queryset=ChildAvatar.objects.all(), required=False
    )

    class Meta:
        model = Child
        fields = [
            "id",
            "name",
            "registration_date",
            "avatar",
        ]
