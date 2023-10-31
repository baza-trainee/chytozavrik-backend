from rest_framework.response import Response
from django.db.models.functions import TruncMonth, ExtractYear
from django.db.models import Count
from rest_framework import permissions, views

from user_profile.models import Child, User
from . import serializers


class UserStatisticsView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UserStatisticsSerializer

    def get(self, request, *args, **kwargs):
        queryset = (
            User.objects.annotate(year=ExtractYear("date_joined"))
            .annotate(month=TruncMonth("date_joined"))
            .values("year", "month")
            .annotate(count=Count("id"))
            .order_by("year")
            .values("year", "month", "count")
        )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ChildStatisticsView(views.APIView):
    serializer_class = serializers.UserStatisticsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = (
            Child.objects.annotate(year=ExtractYear("registration_date"))
            .annotate(month=TruncMonth("registration_date"))
            .values("year", "month")
            .annotate(count=Count("id"))
            .order_by("year")
            .values("year", "month", "count")
        )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
