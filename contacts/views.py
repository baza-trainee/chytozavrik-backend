from django.core.exceptions import ValidationError
from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from drf_yasg.utils import swagger_auto_schema
from .models import Contact
from .serializers import ContactSerializer
from rest_framework import status

from user_profile.swagger_serializers import create_custom_response_serializer

# import re


# def is_valid_phone(phone):
#     return bool(re.match(r"^\+380\d{9}$", phone))


CONTACT_SERIALIZER = create_custom_response_serializer(ContactSerializer)


class ContactAPIView(views.APIView):
    class_serializer = ContactSerializer

    def get_permissions(self):
        permission_classes = {
            "GET": [AllowAny()],
            "POST": [IsAdminUser()],
            "PUT": [IsAdminUser()],
        }
        return permission_classes.get(self.request.method, [])

    @swagger_auto_schema(responses={200: CONTACT_SERIALIZER})
    def get(self, request):
        if not Contact.objects.exists():
            return Response({"detail": "Not found."}, 404)
        query = Contact.objects.all().first()
        serializer = self.class_serializer(query)
        return Response(serializer.data)

    @swagger_auto_schema(
        responses={201: CONTACT_SERIALIZER}, request_body=ContactSerializer
    )
    def post(self, request):
        serializer = self.class_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        first_phone = request.data["first_phone"]
        second_phone = request.data["second_phone"]

        # if not is_valid_phone(first_phone):
        #     return Response(
        #         {"detail": "Невірний формат першого номера телефона"},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )
        # if not is_valid_phone(second_phone):
        #     return Response(
        #         {"detail": "Невірний формат другого номера телефона"},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )
        if first_phone == second_phone:
            return Response(
                {"detail": "Номери телефонів співпадають"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            serializer.save()
        except ValidationError as e:
            return Response({"detail": e}, 400)

            # return Response({"detail": "Такий контакт вже існує"}, 400)
        return Response(serializer.data)

    @swagger_auto_schema(
        responses={200: CONTACT_SERIALIZER}, request_body=ContactSerializer
    )
    def put(self, request):
        if not Contact.objects.exists():
            return Response({"detail": "Not found."}, 404)

        query = Contact.objects.all().first()
        serializer = self.class_serializer(data=request.data, instance=query)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
