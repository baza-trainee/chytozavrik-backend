from rest_framework import serializers
from .models import Book, RecommendationBook


class BookSerializers(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BookPatchSerializer(BookSerializers):
    title = serializers.CharField(required=False)
    author = serializers.CharField(required=False)
    cover_image = serializers.ImageField(required=False)


class RecommendationBookSerializer(BookSerializers):
    recommendation_id = serializers.SerializerMethodField()

    def get_recommendation_id(self, obj):
        recommendation = obj.recommendations.first()
        return recommendation.id if recommendation else None


class RecommendationBookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationBook
        fields = '__all__'
