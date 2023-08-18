from rest_framework import serializers
from django.db import transaction
from .models import Book, RecommendationBook, Quiz, Question, Answer, TrueAnswer, QuizReward


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BookPatchSerializer(BookSerializer):
    title = serializers.CharField(required=False)
    author = serializers.CharField(required=False)
    cover_image = serializers.ImageField(required=False)


class RecommendationBookSerializer(BookSerializer):
    recommendation_id = serializers.SerializerMethodField()

    def get_recommendation_id(self, obj):
        recommendation = obj.recommendations
        return recommendation.id if recommendation else None


class RecommendationBookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationBook
        fields = '__all__'


class QuizSerializer(BookSerializer):
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
