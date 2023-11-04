from rest_framework import serializers, status
from .models import User, ChildAvatar, Child
from django.utils import timezone
from django.db.models import Count


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={"input_type": "password"}, write_only=True, min_length=6
    )

    class Meta:
        model = User
        fields = ["id", "email", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 6},
            "email": {"min_length": 3},
        }

    def validate(self, data):
        password = data.get("password")
        password2 = data.pop("password2")

        if password != password2:
            raise serializers.ValidationError({"password": "Паролі не співпадають."})

        if len(password) < 6:
            raise serializers.ValidationError(
                {"password": "Пароль повинен містити принаймні 6 символів."}
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

    def validate(self, attrs):
        user = self.context["request"].user
        children_count = Child.objects.filter(parent=user).count()
        if children_count >= 6:
            raise serializers.ValidationError(
                {"detail": "Не можна додати більше ніж 6 дітей."})
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
            "unique_quizzes_passed",
            "total_successful_attempts",
            "last_quiz_id",
            "quizzes_passed_today_max_score",
        ]


class EmptySerializer(serializers.Serializer):
    pass
