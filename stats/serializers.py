from rest_framework import serializers


class UserStatisticsSerializer(serializers.Serializer):
    year = serializers.DateTimeField()
    month = serializers.DateTimeField()
    count = serializers.IntegerField()

    def to_representation(self, instance):
        month = instance["month"].strftime("%B")
        return {
            "year": instance["year"],
            "month": month,
            "count": instance["count"],
        }


class QuizStatisticsSerializer(serializers.Serializer):
    quiz_title = serializers.CharField()
    num_unique_children = serializers.IntegerField()
    total_attempts = serializers.IntegerField()

    def to_representation(self, instance):
        return {
            "quiz_title": instance["quiz_title"],
            "num_unique_children": instance["num_unique_children"],
            "total_attempts": instance["total_attempts"],
        }
