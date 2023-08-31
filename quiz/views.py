from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import mixins
from rest_framework import permissions
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from user_profile.models import Child
from .models import Book, RecommendationBook, Quiz, QuizReward, Answer, TrueAnswer, ChildQuizAttempt, ChildReward
from . import serializers
from .pagination import ResultsSetPagination
from user_profile.swagger_serializers import create_custom_response_serializer

PAGE_PARAMETER = openapi.Parameter('page', openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER)
PAGE_SIZE_PARAMETER = openapi.Parameter('page_size', openapi.IN_QUERY, description="Number of items per page",
                                        type=openapi.TYPE_INTEGER)
BOOK_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.BookSerializer)()
RECOMMENDATION_BOOK_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.BookSerializer)()
CREATE_QUIZ_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizCreateSerializer)()
INFO_QUIZ_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizInfoSerializer)()
QUIZ_REWARD_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizRewardSerializer)()
LIST_QUIZ_REWARD_SWAGGER_SERIALIZER = create_custom_response_serializer(serializers.QuizRewardSerializer, True)()
SUBMIT_ANSWER_RESPONSE_SERIALIZER = create_custom_response_serializer(serializers.SubmitAnswerResponseSerializer)


def is_access_to_question(user_question, actual_question):
    return user_question == actual_question


def has_reached_max_score(child_attempt, question):
    return question.answers.count() == child_attempt.score


def reset_quiz(child_attempt):
    child_attempt.score = 0
    child_attempt.save()


def update_score(child_attempt):
    child_attempt.score += 1
    child_attempt.save()


def submit_answer_response(is_correct, child_reward_id=None):
    return {
        'is_answer_correct': is_correct,
        'child_reward_id': child_reward_id
    }


@swagger_auto_schema(
    method='post',
    request_body=serializers.SubmitAnswerSerializer,
    responses={'200': SUBMIT_ANSWER_RESPONSE_SERIALIZER}
)
@api_view(['POST'])
def submit_answer_api(request, question_id):
    serializer = serializers.SubmitAnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    child_query_set = Child.objects.select_related('parent')
    child = get_object_or_404(child_query_set, pk=serializer.data.get('child_id'), parent=request.user)
    answer_query_set = Answer.objects.select_related('question__quiz')
    answer = get_object_or_404(answer_query_set, pk=serializer.data.get('answer_id'), question=question_id)
    question = answer.question
    quiz = answer.question.quiz
    child_attempt, created = ChildQuizAttempt.objects.get_or_create(child=child, quiz=quiz)
    quiz_questions = list(quiz.questions.all())

    if has_reached_max_score(child_attempt, question):
        reset_quiz(child_attempt)
    if not is_access_to_question(question, quiz_questions[child_attempt.score]):
        return Response({'detail': 'You don\'t have access to this question'}, status=status.HTTP_403_FORBIDDEN)
    is_answer_correct = TrueAnswer.objects.filter(question=question, answer=answer).exists()
    child_reward_id = None
    if is_answer_correct:
        update_score(child_attempt)
    if has_reached_max_score(child_attempt, question):
        child_reward, create = ChildReward.objects.get_or_create(child=child, quiz=quiz, reward=quiz.reward)
        child_reward_id = child_reward.id
    return Response(submit_answer_response(is_answer_correct, child_reward_id))


class BookViewSet(ModelViewSet):
    pagination_class = ResultsSetPagination
    queryset = Book.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = permissions.IsAdminUser,

    @swagger_auto_schema(manual_parameters=[
        PAGE_PARAMETER,
        PAGE_SIZE_PARAMETER,
    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: BOOK_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return serializers.BookPatchSerializer
        return serializers.BookSerializer


class RecommendationBookViewSet(mixins.CreateModelMixin,
                                 mixins.DestroyModelMixin,
                                 mixins.ListModelMixin,
                                 GenericViewSet):

    pagination_class = ResultsSetPagination

    @swagger_auto_schema( manual_parameters=[
        PAGE_PARAMETER,
        PAGE_SIZE_PARAMETER,
    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: RECOMMENDATION_BOOK_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        if self.action == 'list':
            return Book.objects.filter(recommendations__isnull=False).distinct()
        return RecommendationBook.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.RecommendationBookSerializer
        return serializers.RecommendationBookCreateSerializer

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


class QuizViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):

    pagination_class = ResultsSetPagination

    @swagger_auto_schema(manual_parameters=[
        PAGE_PARAMETER,
        PAGE_SIZE_PARAMETER,
    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: CREATE_QUIZ_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: INFO_QUIZ_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.action == 'list':
            return Book.objects.filter(quiz__isnull=False)
        elif self.action == 'retrieve':
            Quiz.objects.all().prefetch_related('questions__answers')
        return Quiz.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.QuizSerializer
        elif self.action == 'retrieve':
            return serializers.QuizInfoSerializer
        return serializers.QuizCreateSerializer


class QuizRewardViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = serializers.QuizRewardSerializer
    queryset = QuizReward.objects.all()
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(responses={200: LIST_QUIZ_REWARD_SWAGGER_SERIALIZER})
    def list(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
