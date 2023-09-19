from rest_framework import serializers
from django.db import transaction
from cloudinary import CloudinaryImage
from .models import (Book, RecommendationBook, Quiz, Question, Answer, TrueAnswer, QuizReward, ChildReward,
                     ChildQuizAttempt)


class BookSerializer(serializers.ModelSerializer):
    state = serializers.SerializerMethodField()

    def get_state(self, obj):
        state = []
        if RecommendationBook.objects.filter(book=obj).exists():
            state.append('Рекомендована')

        if Quiz.objects.filter(book=obj).exists():
            state.append('Вікторина')

        return state

    class Meta:
        model = Book
        fields = '__all__'


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
        exclude = ('id',)


class RecommendationBookSerializer(BookWithIDSerializer):
    recommendation_id = serializers.SerializerMethodField()

    def get_recommendation_id(self, obj):
        recommendation = obj.recommendations
        return recommendation.id if recommendation else None


class RecommendationBookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationBook
        fields = '__all__'


class QuizSerializer(BookWithIDSerializer):
    quizz_id = serializers.SerializerMethodField()

    def get_quizz_id(self, obj):
        quiz = obj.quiz
        return quiz.id if quiz else None


class AnswerSerializer(serializers.ModelSerializer):
    is_true = serializers.BooleanField(default=False, write_only=True)

    class Meta:
        model = Answer
        exclude = ('question',)


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        exclude = ('quiz',)


class QuizInfoSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    book_info = serializers.SerializerMethodField()

    def get_book_info(self, obj):
        book_info = {
            'name': obj.book.title,
            'author': obj.book.author,
        }

        return book_info

    class Meta:
        model = Quiz
        exclude = ('book', 'created_at', 'updated_at')


class QuizCreateSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        quiz = Quiz.objects.create(book=validated_data.pop('book'))
        questions_data = validated_data.pop('questions')
        self.create_questions(quiz, questions_data)
        return quiz

    def create_questions(self, quiz, questions):
        for question in questions:
            current_question = Question.objects.create(quiz=quiz, text=question.pop('text'))
            answers_data = question.pop('answers')
            self.create_answers(current_question, answers_data)

    def create_answers(self, question, answers):
        true_answer = 0
        for answer in answers:
            current_answer = Answer.objects.create(question=question, text=answer['text'])
            if answer['is_true']:
                true_answer += 1
                TrueAnswer.objects.create(question=question, answer=current_answer)
        if true_answer != 1:
            raise serializers.ValidationError(
                {'detail': f'You need to mark exactly one true answer for question {question.text}'})

    class Meta:
        model = Quiz
        fields = '__all__'


class QuizRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizReward
        fields = '__all__'


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
        cloudinary_url = CloudinaryImage(reward).build_url()
        return str(cloudinary_url)

    class Meta:
        model = ChildReward
        fields = '__all__'


class ChildAttemptSerializer(serializers.ModelSerializer):
    quiz_id = serializers.IntegerField()

    class Meta:
        model = ChildQuizAttempt
        exclude = ('id', 'child', 'quiz')


class DetailChildAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildQuizAttempt
        exclude = ('id', 'child', 'quiz')
