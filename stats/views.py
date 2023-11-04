from rest_framework.response import Response
from rest_framework import permissions, views
from django.db.models import Count, Sum, Q, functions
from drf_yasg.utils import swagger_auto_schema

from quiz.models import Quiz
from user_profile.models import Child, User
from . import serializers
from stats.models import MonthlyActiveChild


class UserStatisticsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = serializers.UserStatisticsSerializer

    @swagger_auto_schema(
        responses={200: serializers.UserStatisticsSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        queryset = (
            User.objects.annotate(year=functions.ExtractYear("date_joined"))
            .annotate(month=functions.TruncMonth("date_joined"))
            .values("year", "month")
            .annotate(count=Count("id"))
            .order_by("year")
            .values("year", "month", "count")
        )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ChildStatisticsView(views.APIView):
    serializer_class = serializers.UserStatisticsSerializer
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(
        responses={200: serializers.UserStatisticsSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        queryset = (
            Child.objects.annotate(year=functions.ExtractYear("registration_date"))
            .annotate(month=functions.TruncMonth("registration_date"))
            .values("year", "month")
            .annotate(count=Count("id"))
            .order_by("year")
            .values("year", "month", "count")
        )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class QuizStatisticsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(
        responses={200: serializers.QuizStatisticsSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        quiz_statistics = Quiz.objects.annotate(
            num_children=Count(
                "childquizattempt__child",
                filter=Q(childquizattempt__total_attempts__gt=0),
                distinct=True,
            ),
            total_attempts_sum=Sum("childquizattempt__total_attempts"),
        )
        statistics_data = []
        for quiz in quiz_statistics:
            statistics_data.append(
                {
                    "quiz_title": quiz.book.title,
                    "num_unique_children": quiz.num_children,
                    "total_attempts": quiz.total_attempts_sum,
                }
            )

        return Response(statistics_data)


class ActiveChildrenView(views.APIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = serializers.ActiveChildSerializer

    @swagger_auto_schema(responses={200: serializers.ActiveChildSerializer(many=True)})
    def get(self, request, *args, **kwargs):
        queryset = (
            MonthlyActiveChild.objects.values("year", "month")
            .annotate(count=Count("child", distinct=True))
            .order_by("year", "month")
        )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
