from rest_framework import serializers
from .models import Book, RecommendationBook


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BookPatchSerializer(BookSerializer):
    title = serializers.CharField(required=False)
    author = serializers.CharField(required=False)
    cover_image = serializers.ImageField(required=False)


class RecommendationBookSerializer(BookSerializer):
    recommendation_id = serializers.SerializerMethodField()

    def get_recommendation_id(self, obj):
        recommendation = obj.recommendations
        return recommendation.id if recommendation else None


class RecommendationBookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationBook
        fields = '__all__'
