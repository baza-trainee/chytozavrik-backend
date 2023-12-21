from rest_framework import serializers
from django.db import transaction
from drf_yasg.utils import swagger_serializer_method
from cloudinary import CloudinaryResource
from django.utils import timezone
from django.core.validators import FileExtensionValidator

from .models import (
    Book,
    Quiz,
    Question,
    Answer,
    TrueAnswer,
    QuizReward,
    ChildReward,
    ChildQuizAttempt,
)


class BookSerializer(serializers.ModelSerializer):
    state = serializers.SerializerMethodField()

    def get_state(self, obj: Book):
        if all([obj.is_recommended, Quiz.objects.filter(book=obj).exists()]):
            return ["Рекомендована", "Вікторина"]
        if obj.is_recommended:
            return "Рекомендована"
        if Quiz.objects.filter(book=obj).exists():
            return "Вікторина"
        return []

    class Meta:
        model = Book
        fields = "__all__"


class BookPatchSerializer(BookSerializer):
    title = serializers.CharField(required=False)
    author = serializers.CharField(required=False)
    cover_image = serializers.ImageField(required=False)


class BookWithIDSerializer(BookSerializer):
    book_id = serializers.SerializerMethodField(read_only=True)
    state = None

    def get_book_id(self, obj):
        return obj.id

    class Meta:
        model = Book
        exclude = ("id",)


class QuizSerializer(BookWithIDSerializer):
    quizz_id = serializers.SerializerMethodField()

    def get_quizz_id(self, obj):
        quiz = obj.quiz
        return quiz.id if quiz else None


class AnswerAdminSerializer(serializers.ModelSerializer):
    is_true = serializers.SerializerMethodField()

    def get_is_true(self, obj):
        return TrueAnswer.objects.filter(question=obj.question, answer=obj).exists()

    class Meta:
        model = Answer
        exclude = ("question",)


class QuestionAdminSerializer(serializers.ModelSerializer):
    answers = AnswerAdminSerializer(many=True)

    class Meta:
        model = Question
        exclude = ("quiz",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not self.context["request"].user.is_staff:
            for answer in data["answers"]:
                if "is_true" in answer:
                    del answer["is_true"]
        return data


class AnswerSerializer(serializers.ModelSerializer):
    is_true = serializers.BooleanField(default=False, write_only=True)

    class Meta:
        model = Answer
        exclude = ("question",)


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        exclude = ("quiz",)


class BookInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    author = serializers.CharField()


class QuizInfoSerializer(serializers.ModelSerializer):
    questions = QuestionAdminSerializer(many=True)
    book_info = serializers.SerializerMethodField()
    reward_id = serializers.SerializerMethodField()
    reward_as_url = serializers.SerializerMethodField()

    def get_reward_id(self, obj):
        if getattr(obj, 'reward', None):
            return obj.reward.id
        else:
            return None
        
    def get_reward_as_url(self, obj):
        if getattr(obj, 'reward', None):
            reward = str(obj.reward.reward)
            # media_url = self.context['request'].build_absolute_uri('/media/')
            # media_url += avatar
            cloudinary_url = CloudinaryResource(reward, resource_type="raw").build_url()
            return cloudinary_url
        return None


    @swagger_serializer_method(serializer_or_field=BookInfoSerializer)
    def get_book_info(self, obj):
        book_info = {
            "id": obj.book.id,
            "name": obj.book.title,
            "author": obj.book.author,
        }
        return book_info

    class Meta:
        model = Quiz
        exclude = ("book", "created_at", "updated_at")


class QuizCreateSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        for question in validated_data["questions"]:
            self.validate_answers(question["text"], question["answers"])
        quiz = Quiz.objects.create(book=validated_data.pop("book"))
        questions_data = validated_data.pop("questions")
        self.create_questions(quiz, questions_data)
        return quiz

    @transaction.atomic
    def update(self, instance, validated_data):
        if validated_data.get("questions"):
            for question in validated_data["questions"]:
                self.validate_answers(question["text"], question["answers"])
            questions_data = validated_data.pop("questions", [])
            instance = self.update_instance(instance, validated_data)
            self.update_questions(instance, questions_data)
            model = Book.objects.filter(id=instance.book.id)
            model.update(updated_at=timezone.now())
            return instance
        else:
            raise serializers.ValidationError(
                {"detail": "Не передано даних для оновлення."}
            )

    def update_instance(self, instance, validated_data):
        instance.book = validated_data.get("book", instance.book)
        instance.save()
        return instance

    def update_questions(self, instance, questions_data):
        instance.questions.all().delete()
        self.create_questions(instance, questions_data)

    def create_questions(self, quiz, questions):
        for question in questions:
            answers_data = question.pop("answers")
            current_question = Question.objects.create(
                quiz=quiz, text=question.pop("text")
            )
            self.create_answers(current_question, answers_data)

    def create_answers(self, question, answers):
        for answer in answers:
            current_answer = Answer.objects.create(
                question=question, text=answer["text"]
            )
            if answer["is_true"]:
                TrueAnswer.objects.create(question=question, answer=current_answer)

    def validate_answers(self, question_text, answers):
        true_answer = len([answer for answer in answers if answer["is_true"]])
        if true_answer != 1:
            if true_answer > 1:
                detail = f"Можна вказати лише одну вірну відповідь на питання '{question_text}'"
            else:
                detail = (
                    f"Необхідно вказати вірну відповідь на питання '{question_text}'"
                )
            raise serializers.ValidationError({"detail": detail})

    class Meta:
        model = Quiz
        fields = "__all__"


class QuizRewardSerializer(serializers.ModelSerializer):
    reward = serializers.FileField(
        validators=[
            FileExtensionValidator(allowed_extensions=["svg", "png", "jpg", "webp"])
        ]
    )

    class Meta:
        model = QuizReward
        fields = "__all__"


class QuizRewardPatchSerializer(QuizRewardSerializer):
    class Meta:
        model = QuizReward
        fields = "__all__"
        extra_kwargs = {
            "reward": {"required": False},
            "quiz": {"required": False},
        }


class SubmitAnswerSerializer(serializers.Serializer):
    child_id = serializers.IntegerField()
    answer_id = serializers.IntegerField()


class SubmitAnswerResponseSerializer(serializers.Serializer):
    is_answer_correct = serializers.BooleanField()
    child_reward_url = serializers.IntegerField(allow_null=True)


class ChildRewardSerializer(serializers.ModelSerializer):
    reward = serializers.SerializerMethodField()

    def get_reward(self, obj):
        reward = str(obj.reward.reward)
        cloudinary_url = CloudinaryResource(reward, resource_type="raw").build_url()
        return str(cloudinary_url)

    class Meta:
        model = ChildReward
        fields = "__all__"


class ChildAttemptSerializer(serializers.ModelSerializer):
    quiz_id = serializers.IntegerField()

    class Meta:
        model = ChildQuizAttempt
        exclude = ("id", "child", "quiz")


class DetailChildAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildQuizAttempt
        exclude = ("id", "child", "quiz")


class BookForChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "author", "cover_image"]


class ChildQuizSerializer(serializers.ModelSerializer):
    current_score = serializers.SerializerMethodField()
    book = BookForChildSerializer()

    def get_current_score(self, obj):
        child_id = self.context["child_id"]
        max_questions = obj.questions.count()
        try:
            child_quiz_attempt = ChildQuizAttempt.objects.get(
                child_id=child_id, quiz=obj
            )
            return f"{child_quiz_attempt.score}/{max_questions}"
        except ChildQuizAttempt.DoesNotExist:
            return None

    class Meta:
        model = Quiz
        fields = ["id", "current_score", "book"]
