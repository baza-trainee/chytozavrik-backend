from django.contrib.auth.hashers import check_password
from user_profile.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email", "").lower()
        request.data["email"] = email
        password_data = request.data.get("password")
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"detail": "Такого користувача не існує"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(password_data, user.password):
            return Response(
                {"detail": "Не вірно вказаний пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().post(request, *args, **kwargs)
