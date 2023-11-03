from . import views
from rest_framework.routers import DefaultRouter
from django.urls import path, include

app_name = "statistics"

router = DefaultRouter()
urlpatterns = [
    path("statistics/", include(router.urls)),
    path(
        "statistics/users/", views.UserStatisticsView.as_view(), name="users-statistics"
    ),
    path(
        "statistics/child/",
        views.ChildStatisticsView.as_view(),
        name="child-statistics",
    ),
    path(
        "statistics/quizzes/",
        views.QuizStatisticsView.as_view(),
        name="quizz-statistics",
    ),
]
