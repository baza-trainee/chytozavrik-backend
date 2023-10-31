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
