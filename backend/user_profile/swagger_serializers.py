from rest_framework import serializers
from .models import Child, User


class UserSwaggerPostSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    email = serializers.EmailField(
        min_length=3,
    )

    class Meta:
        model = User
        fields = ["email", "password", "password2"]
        extra_kwargs = {"password": {"write_only": True}}
        ref_name = "UserPostInfo"


class UserSwaggerGetSerializer(serializers.ModelSerializer):
    childs = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "is_superuser", "email", "childs", "date_joined"]
        extra_kwargs = {"password": {"write_only": True}}
        ref_name = "UserInfo"

    def get_childs(self, obj):
        childs = Child.objects.filter(parent=obj.id).values_list("name", flat=True)
        return childs


def create_custom_response_serializer(serializer_class, many=False):
    class CustomResponseSerializer(serializers.Serializer):
        """
        This serializer is used only for swagger documentation.
        It describes the custom structure of your API response.
        """

        status = serializers.CharField()
        if many:
            data = serializer_class(many=True, read_only=True)
        else:
            data = serializer_class(read_only=True)

        ref_name = (
            f"CustomResponse_{serializer_class.__name__}_List"
            if many
            else f"CustomResponse_{serializer_class.__name__}"
        )
        Meta = type("Meta", (), {"ref_name": ref_name})

    return CustomResponseSerializer
