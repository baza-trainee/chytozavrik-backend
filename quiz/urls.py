from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

app_name = "quiz"

router = DefaultRouter()
router.register(r"books", views.BookViewSet, basename="book")
router.register(
    r"recommendation-books",
    views.RecommendationBookViewSet,
    basename="recommendation-books",
)
router.register(r"quizzes", views.QuizViewSet, basename="quizz")
router.register(r"quizzes-rewards", views.QuizRewardViewSet, basename="quiz-reward")

urlpatterns = [
    path(
        "questions/<question_id>/submit-answer",
        views.submit_answer_api,
        name="submit-answer",
    ),
    path(
        "users/me/children/<int:child_id>/rewards/",
        views.ChildRewardListAPIView.as_view(),
        name="list-child-rewards",
    ),
    path(
        "users/me/children/<int:child_id>/rewards/<int:pk>/",
        views.ChildRewardRetrieveAPIView.as_view(),
        name="detail-child-rewards",
    ),
    path(
        "users/me/children/<int:child_id>/attempts/",
        views.ChildAttemptListAPIView.as_view(),
        name="list-child-attempts",
    ),
    path(
        "users/me/children/<int:child_id>/attempts/<int:quiz_id>/",
        views.get_child_attempt_by_quiz_api,
        name="detail-child-attempts",
    ),
]
urlpatterns += router.urls
