from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import mixins, filters, permissions, status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import permission_classes, api_view, action
from django.db.models import Q, OuterRef, Subquery, IntegerField
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from cloudinary import CloudinaryResource
from django.utils import timezone
from django.core.cache import cache, caches

from chytozavrik.settings.base import BASE_URL, TIME_HALF_DAY
from chytozavrik.helpers import ResultsSetPagination
from stats.models import MonthlyActiveChild
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


def update_score(child_attempt, quiz):
    child_attempt.score += 1
    if child_attempt.score == quiz.questions.count():
        child_attempt.total_attempts += 1
    child_attempt.last_attempt_date = timezone.now()
    child_attempt.save()


def submit_answer_response(is_correct, child_reward_url=None):
    return {"is_answer_correct": is_correct, "child_reward_url": child_reward_url}


def get_child(user, child_id):
    child_query_set = Child.objects.select_related("parent")
    try:
        return child_query_set.get(pk=child_id, parent=user)
    except Child.DoesNotExist:
        return None


def get_answer(answer_id, question_id):
    answer_query_set = Answer.objects.select_related("question__quiz")
    try:
        return answer_query_set.get(pk=answer_id, question=question_id)
    except Answer.DoesNotExist:
        return None


def update_monthly_active_child(child, last_attempt_date):
    year = last_attempt_date.year
    month = last_attempt_date.month
    active_child, created = MonthlyActiveChild.objects.get_or_create(
        child=child, year=year, month=month
    )
    active_child.is_active = True
    active_child.save()


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
    http_method_names = ["get", "post", "patch", "delete"]
    pagination_class = ResultsSetPagination
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "author"]
    book_cache = caches["book_cache"]
    book_recommended_cache = caches["book_recommended_cache"]
    quiz_cache = caches["quiz_cache"]

    def get_queryset(self):
        is_recommended: str = self.request.query_params.get("is_recommended", None)
        is_not_quiz: str = self.request.query_params.get("is_not_quiz", None)
        query = Book.objects.order_by("-updated_at")
        if is_recommended and is_recommended.lower() == "true":
            query = query.filter(is_recommended=True)
        if is_not_quiz and is_not_quiz.lower() == "true":
            query = query.filter(quiz__isnull=True)
        return query

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "is_recommended",
                openapi.IN_QUERY,
                description="Filter by is_recommended state",
                type=openapi.TYPE_BOOLEAN,
            ),
            openapi.Parameter(
                "is_not_quiz",
                openapi.IN_QUERY,
                description="Filter by not is_quiz state",
                type=openapi.TYPE_BOOLEAN,
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get("search", None)
        if search_query:
            cache_key = f"book_search_{search_query}"
            cached_data = self.book_cache.get(cache_key)
        else:
            cache_key = "book_list"
            cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            if cache_key.startswith("book_search_"):
                self.book_cache.set(cache_key, response.data, TIME_HALF_DAY)
            else:
                cache.set(cache_key, response.data, TIME_HALF_DAY)
        return response

    @swagger_auto_schema(responses={201: BOOK_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        data = request.data
        data["author"] = data["author"].strip()
        data["title"] = data["title"].strip()
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
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            cache.delete_many(["book_list", "book_recommended_list"])
            self.book_cache.clear()
            self.book_recommended_cache.clear()
        return response

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        cache_key = f'book_{kwargs["pk"]}'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        response = super().retrieve(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            cache.set(cache_key, response.data, TIME_HALF_DAY)
        return response

    @swagger_auto_schema(responses={200: BOOK_SWAGGER_SERIALIZER})
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            cache.delete_many(
                ["book_list", f'book_{kwargs["pk"]}', "book_recommended_list"]
            )
            self.book_cache.clear()
            self.book_recommended_cache.clear()
        return response

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            cache.delete_many(
                ["book_list", f'book_{kwargs["pk"]}', "book_recommended_list"]
            )
            self.book_cache.clear()
            self.book_recommended_cache.clear()
            self.quiz_cache.clear()
        return response

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
    book_recommended_cache = caches["book_recommended_cache"]

    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get("search", None)
        if search_query:
            cache_key = f"book_rec_search_{search_query}"
            cached_data = self.book_recommended_cache.get(cache_key)
        else:
            cache_key = "book_recommended_list"
            cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)

        if cache_key.startswith("book_rec_search_"):
            self.book_recommended_cache.set(cache_key, response.data, TIME_HALF_DAY)
        else:
            cache.set(cache_key, response.data, TIME_HALF_DAY)
        return response

    def get_queryset(self):
        queryset = Book.objects.filter(is_recommended=True).order_by("-updated_at")
        search_query = self.request.query_params.get("search", None)

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(author__icontains=search_query)
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
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    pagination_class = ResultsSetPagination
    http_method_names = ["get", "post", "patch", "delete"]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "author"]
    quiz_cache = caches["quiz_cache"]
    book_cache = caches["book_cache"]
    default_cache = caches["default"]
    book_recommended_cache = caches["book_recommended_cache"]

    @swagger_auto_schema(
        manual_parameters=[PAGE_PARAMETER, PAGE_SIZE_PARAMETER, SEARCH]
    )
    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get("search", None)
        if search_query:
            cache_key = f"quiz_search_{search_query}"
            cached_data = self.quiz_cache.get(cache_key)
        else:
            cache_key = "quiz_list"
            cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            if cache_key.startswith("quiz_search_"):
                self.quiz_cache.set(cache_key, response.data, 3600)
            else:
                cache.set(cache_key, response.data, 3600)

        return response

    @swagger_auto_schema(responses={201: CREATE_QUIZ_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            id = request.data["book"]
            cache.delete_many(
                ["book_list", f"book_{id}", "book_recommended_list", "quiz_list"]
            )
            self.quiz_cache.clear()
            self.book_cache.clear()
            self.book_recommended_cache.clear()

        return response

    @swagger_auto_schema(responses={200: INFO_QUIZ_SWAGGER_SERIALIZER})
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        method="post",
        request_body=serializers.SubmitAnswerSerializer,
        responses={"200": SUBMIT_ANSWER_RESPONSE_SERIALIZER},
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="question/(?P<question_id>[^/.]+)/submit-answer",
    )
    def submit_answer(self, request, question_id=None):
        if not question_id.isdigit():
            return Response(
                {"detail": f"Кінцеву точку з заданим шляхом не знайдено."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = serializers.SubmitAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        child = get_child(request.user, serializer.data.get("child_id"))
        if not child:
            return Response(
                {
                    "detail": f"У поточного користувача немає дитини з ID: {serializer.data.get('child_id')}."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        answer = get_answer(serializer.data.get("answer_id"), question_id)
        if not answer:
            return Response(
                {
                    "detail": f"Запитання з ID: {question_id} не має варіанту відповіді з ID: {serializer.data.get('answer_id')}"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        question = answer.question
        quiz = answer.question.quiz
        quiz_questions = list(quiz.questions.all())
        current_question_index = quiz_questions.index(question)
        child_attempt, created = ChildQuizAttempt.objects.get_or_create(
            child=child, quiz=quiz
        )

        if has_reached_max_score(child_attempt, quiz):
            reset_quiz(child_attempt)

        if current_question_index < child_attempt.score:
            return Response(
                {
                    "detail": "Ви вже дали правильну відповідь на це питання, перейдіть до наступного."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        elif current_question_index > child_attempt.score:
            return Response(
                {
                    "detail": f"Спочатку дайте відповідь на поточне питання: {quiz_questions[child_attempt.score]}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_answer_correct = TrueAnswer.objects.filter(
            question=question, answer=answer
        ).exists()
        child_reward_url = None
        if is_answer_correct:
            update_score(child_attempt, quiz)
            update_monthly_active_child(child, child_attempt.last_attempt_date)
        if has_reached_max_score(child_attempt, quiz):
            if not (hasattr(quiz, "reward") and quiz.reward):
                return Response(
                    submit_answer_response(
                        is_answer_correct, "Винагорода для цієї книги не додана."
                    ),
                    status=status.HTTP_404_NOT_FOUND,
                )
            child_reward, create = ChildReward.objects.select_related(
                "reward"
            ).get_or_create(child=child, quiz=quiz, reward=quiz.reward)
            reward = str(child_reward.reward.reward)
            child_reward_url = f"{BASE_URL}/{('/').join(self.request.build_absolute_uri('/media/').split('/')[-2:])}"
            child_reward_url += reward
            if (
                not settings.DEFAULT_FILE_STORAGE
                == "django.core.files.storage.FileSystemStorage"
            ):
                child_reward_url = CloudinaryResource(
                    reward, resource_type="raw"
                ).build_url()
        return Response(submit_answer_response(is_answer_correct, child_reward_url))

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            id = request.data["book"]
            cache.delete_many(
                ["book_list", f"book_{id}", "book_recommended_list", "quiz_list"]
            )
            self.quiz_cache.clear()
            self.book_cache.clear()
            self.book_recommended_cache.clear()
        return response

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            self.default_cache.clear()
            self.quiz_cache.clear()
            self.book_cache.clear()
            self.book_recommended_cache.clear()

        return response

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.action == "list":
            return Book.objects.filter(quiz__isnull=False).order_by("-updated_at")
        elif self.action == "retrieve":
            Quiz.objects.all().select_related("book").prefetch_related(
                "questions__answers"
            )
        return Quiz.objects.order_by("id").all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.QuizSerializer
        elif self.action == "retrieve":
            return serializers.QuizInfoSerializer
        return serializers.QuizCreateSerializer


class QuizRewardViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]
    parser_classes = (MultiPartParser, FormParser)
    queryset = QuizReward.objects.all()
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(responses={200: LIST_QUIZ_REWARD_SWAGGER_SERIALIZER})
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={201: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def retrieve(self, request, pk):
        try:
            quiz_reward = QuizReward.objects.get(pk=pk)
        except QuizReward.DoesNotExist:
            return Response(
                {"detail": "Винагороди з таким ID не існує."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = serializers.QuizRewardSerializer(quiz_reward)
        return Response(serializer.data)

    @swagger_auto_schema(responses={200: QUIZ_REWARD_SWAGGER_SERIALIZER})
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == "partial_update":
            return serializers.QuizRewardPatchSerializer
        return serializers.QuizRewardSerializer


class ChildRewardListAPIView(ListAPIView):
    pagination_class = ResultsSetPagination
    serializer_class = serializers.ChildRewardSerializer
    permission_classes = [
        HasPermissionToViewChildRewards,
    ]

    def get_queryset(self):
        child_id = self.kwargs.get("child_id")
        return (
            ChildReward.objects.select_related("reward")
            .filter(child__parent=self.request.user.pk, child=child_id)
            .order_by("-received_at")
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


class ChildQuizzesListAPIView(ListAPIView):
    serializer_class = serializers.ChildQuizSerializer
    pagination_class = ResultsSetPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["child_id"] = self.kwargs.get("child_id")
        return context

    def get_queryset(self):
        child_id = self.kwargs.get("child_id")
        quizzes = Quiz.objects.annotate(
            current_score=Subquery(
                ChildQuizAttempt.objects.filter(
                    child_id=child_id, quiz=OuterRef("pk")
                ).values("score")[:1],
                output_field=IntegerField(),
            )
        )
        is_started: str = self.request.query_params.get("is_started", None)
        is_completed: str = self.request.query_params.get("is_completed", False)
        reverse: str = self.request.query_params.get("reverse", None)
        search_query = self.request.query_params.get("search", None)
        if is_started and is_started.lower() == "true":
            quizzes = quizzes.filter(current_score__range=(0, 4))
        if is_completed and is_completed.lower() == "true":
            quizzes = quizzes.filter(current_score=5)

        if search_query:
            quizzes = quizzes.filter(
                Q(book__title__icontains=search_query)
                | Q(book__author__icontains=search_query)
            )

        if reverse and reverse.lower() == "true":
            quizzes = quizzes.order_by("-current_score")
        else:
            quizzes = quizzes.order_by("current_score")

        return quizzes

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "reverse",
                openapi.IN_QUERY,
                description="Reverse the order of quiz sorting",
                type=openapi.TYPE_BOOLEAN,
            ),
            openapi.Parameter(
                "search",
                openapi.IN_QUERY,
                description="Search query for title or author",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "is_started",
                openapi.IN_QUERY,
                description="Filter by is_started parameter",
                type=openapi.TYPE_BOOLEAN,
            ),
            openapi.Parameter(
                "is_completed",
                openapi.IN_QUERY,
                description="Filter by is_completed parameter",
                type=openapi.TYPE_BOOLEAN,
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        child = get_child(request.user, self.kwargs.get("child_id"))
        if not child:
            return Response(
                {
                    "detail": f"У поточного користувача немає дитини з ID: {self.kwargs.get('child_id')}."
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        return self.list(request, *args, **kwargs)
