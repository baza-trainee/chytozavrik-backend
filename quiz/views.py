from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import mixins, filters, permissions
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import permission_classes, api_view
from django.shortcuts import get_object_or_404
from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from cloudinary import CloudinaryImage

from user_profile.models import Child
from .models import (
    Book,
    Quiz,
    QuizReward,
    Answer,
    TrueAnswer,
    ChildQuizAttempt,
    ChildReward,
)
from . import serializers
from .pagination import ResultsSetPagination
from user_profile.swagger_serializers import create_custom_response_serializer
from .permissions import HasPermissionToViewChildRewards

PAGE_PARAMETER = openapi.Parameter(
    "page", openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER
)
PAGE_SIZE_PARAMETER = openapi.Parameter(
    "page_size",
    openapi.IN_QUERY,
    description="Number of items per page",
    type=openapi.TYPE_INTEGER,
)
SEARCH = openapi.Parameter(
    "search", openapi.IN_QUERY, description="Quiz search", type=openapi.TYPE_STRING
)
BOOK_SWAGGER_SERIALIZER = create_custom_response_serializer(
    serializers.BookSerializer
)()
RECOMMENDATION_BOOK_SWAGGER_SERIALIZER = create_custom_response_serializer(
    serializers.BookSerializer
)()
CREATE_QUIZ_SWAGGER_SERIALIZER = create_custom_response_serializer(
    serializers.QuizCreateSerializer
)()
INFO_QUIZ_SWAGGER_SERIALIZER = create_custom_response_serializer(
    serializers.QuizInfoSerializer
)()
QUIZ_REWARD_SWAGGER_SERIALIZER = create_custom_response_serializer(
    serializers.QuizRewardSerializer
)()
LIST_QUIZ_REWARD_SWAGGER_SERIALIZER = create_custom_response_serializer(
    serializers.QuizRewardSerializer, True
)()
SUBMIT_ANSWER_RESPONSE_SERIALIZER = create_custom_response_serializer(
    serializers.SubmitAnswerResponseSerializer
)
DETAIL_CHILD_ATTEMPT_SERIALIZER = create_custom_response_serializer(
    serializers.DetailChildAttemptSerializer
)()


def is_access_to_question(user_question, actual_question):
    return user_question == actual_question


def has_reached_max_score(child_attempt, quiz):
    return quiz.questions.count() == child_attempt.score


def reset_quiz(child_attempt):
    child_attempt.score = 0
    child_attempt.save()


def update_score(child_attempt):
    child_attempt.score += 1
    child_attempt.save()


def submit_answer_response(is_correct, child_reward_url=None):
    return {"is_answer_correct": is_correct, "child_reward_url": child_reward_url}


@swagger_auto_schema(
    method="post",
    request_body=serializers.SubmitAnswerSerializer,
    responses={"200": SUBMIT_ANSWER_RESPONSE_SERIALIZER},
)
@api_view(["POST"])
def submit_answer_api(request, question_id):
    serializer = serializers.SubmitAnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    child_query_set = Child.objects.select_related("parent")
    child = get_object_or_404(
        child_query_set, pk=serializer.data.get("child_id"), parent=request.user
    )
    answer_query_set = Answer.objects.select_related("question__quiz")
    answer = get_object_or_404(
        answer_query_set, pk=serializer.data.get("answer_id"), question=question_id
    )
    question = answer.question
    quiz = answer.question.quiz
    child_attempt, created = ChildQuizAttempt.objects.get_or_create(
        child=child, quiz=quiz
    )
    quiz_questions = list(quiz.questions.all())

    if has_reached_max_score(child_attempt, quiz):
        reset_quiz(child_attempt)
    if not is_access_to_question(question, quiz_questions[child_attempt.score]):
        return Response(
            {"detail": "You don't have access to this question"},
            status=status.HTTP_403_FORBIDDEN,
        )
    is_answer_correct = TrueAnswer.objects.filter(
        question=question, answer=answer
    ).exists()
    child_reward_url = None
    if is_answer_correct:
        update_score(child_attempt)
    if has_reached_max_score(child_attempt, quiz):
        child_reward, create = ChildReward.objects.select_related(
            "reward"
        ).get_or_create(child=child, quiz=quiz, reward=quiz.reward)
        reward = str(child_reward.reward.reward)
        child_reward_url = CloudinaryImage(reward).build_url()
    return Response(submit_answer_response(is_answer_correct, child_reward_url))


@swagger_auto_schema(method="get", responses={"200": DETAIL_CHILD_ATTEMPT_SERIALIZER})
@api_view(["GET"])
@permission_classes([HasPermissionToViewChildRewards])
def get_child_attempt_by_quiz_api(request, child_id, quiz_id):
    try:
        quiz = Quiz.objects.get(pk=quiz_id)
        attempt = ChildQuizAttempt.objects.get(
            child__parent=request.user.pk, child=child_id, quiz=quiz
        )
    except Quiz.DoesNotExist as e:
        return Response({"detail": f"Quiz with id {quiz_id} does not exist."}, 404)
    except ChildQuizAttempt.DoesNotExist:
        data = {"score": 0}
        serializer = serializers.DetailChildAttemptSerializer(data)
    else:
        serializer = serializers.DetailChildAttemptSerializer(attempt)

    return Response(serializer.data)


class BookViewSet(ModelViewSet, GenericViewSet):
    pagination_class = ResultsSetPagination
    queryset = Book.objects.order_by("id")
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "author"]

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: BOOK_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        data = request.data
        book_exists = Book.objects.filter(
            author__iexact=data["author"], title__iexact=data["title"]
        ).exists()
        if book_exists:
            return Response(
                {
                    "detail": f"Книга автора '{data['author']}' з назвою '{data['title']}' вже існує в базі даних."
                },
                status=status.HTTP_409_CONFLICT,
            )
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
        if self.action == "partial_update":
            return serializers.BookPatchSerializer
        return serializers.BookSerializer


class RecommendationBookViewSet(
    mixins.ListModelMixin,
    GenericViewSet,
):
    pagination_class = ResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "author"]
    http_method_names = ["get"]

    def get_queryset(self):
        queryset = Book.objects.filter(is_recommended=True).order_by("id")
        search_term = self.request.query_params.get("search", None)
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) | Q(author__icontains=search_term)
            )
        return queryset

    def get_serializer_class(self):
        return serializers.BookSerializer

    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class QuizViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    pagination_class = ResultsSetPagination

    @swagger_auto_schema(
        manual_parameters=[PAGE_PARAMETER, PAGE_SIZE_PARAMETER, SEARCH]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: CREATE_QUIZ_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: INFO_QUIZ_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.action == "list":
            search = self.request.query_params.get("search", None)
            if search:
                return Book.objects.filter(
                    Q(quiz__isnull=False)
                    & (
                        Q(title__startswith=search)
                        | Q(author__startswith=search)
                        | Q(title__icontains=search)
                        | Q(author__icontains=search)
                        | Q(title__iexact=search)
                        | Q(author__iexact=search)
                    )
                )
            return Book.objects.filter(quiz__isnull=False)
        elif self.action == "retrieve":
            Quiz.objects.all().select_related("book").prefetch_related(
                "questions__answers"
            )
        return Quiz.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.QuizSerializer
        elif self.action == "retrieve":
            return serializers.QuizInfoSerializer
        return serializers.QuizCreateSerializer


class QuizRewardViewSet(ModelViewSet):
    http_method_names = ["get", "post", "put", "delete"]
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = serializers.QuizRewardSerializer
    queryset = QuizReward.objects.all()
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(responses={200: LIST_QUIZ_REWARD_SWAGGER_SERIALIZER})
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

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


class ChildRewardListAPIView(ListAPIView):
    pagination_class = ResultsSetPagination
    serializer_class = serializers.ChildRewardSerializer
    permission_classes = [
        HasPermissionToViewChildRewards,
    ]

    def get_queryset(self):
        child_id = self.kwargs.get("child_id")
        return ChildReward.objects.select_related("reward").filter(
            child__parent=self.request.user.pk, child=child_id
        )

    @swagger_auto_schema(
        manual_parameters=[
            PAGE_PARAMETER,
            PAGE_SIZE_PARAMETER,
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ChildRewardRetrieveAPIView(RetrieveAPIView):
    serializer_class = serializers.ChildRewardSerializer
    permission_classes = [
        HasPermissionToViewChildRewards,
    ]

    def get_queryset(self):
        child_id = self.kwargs.get("child_id")
        return ChildReward.objects.select_related("reward").filter(
            child__parent=self.request.user.pk, child=child_id
        )


class ChildAttemptListAPIView(ListAPIView):
    pagination_class = ResultsSetPagination
    serializer_class = serializers.ChildAttemptSerializer
    permission_classes = [
        HasPermissionToViewChildRewards,
    ]

    def get_queryset(self):
        child_id = self.kwargs.get("child_id")
        return ChildQuizAttempt.objects.filter(
            child__parent=self.request.user.pk, child=child_id
        )

    @swagger_auto_schema(
        manual_parameters=[
            PAGE_PARAMETER,
            PAGE_SIZE_PARAMETER,
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
