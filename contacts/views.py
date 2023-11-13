from django.core.exceptions import ValidationError
from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from drf_yasg.utils import swagger_auto_schema
from .models import Contact
from .serializers import ContactSerializer
from rest_framework import status

from user_profile.swagger_serializers import create_custom_response_serializer

CONTACT_SERIALIZER = create_custom_response_serializer(ContactSerializer)


class ContactAPIView(views.APIView):
    class_serializer = ContactSerializer

    def get_permissions(self):
        permission_classes = {
            "GET": [AllowAny()],
            "PATCH": [IsAdminUser()],
        }
        return permission_classes.get(self.request.method, [])

    @swagger_auto_schema(responses={200: CONTACT_SERIALIZER})
    def get(self, request):
        if not Contact.objects.exists():
            return Response({"detail": "Номерів телефону не знайдено."}, 404)
        query = Contact.objects.all().first()
        serializer = self.class_serializer(query)
        return Response(serializer.data)

    @swagger_auto_schema(
        responses={200: CONTACT_SERIALIZER},
        request_body=ContactSerializer,
    )
    def patch(self, request):
        first_phone = request.data["first_phone"]
        try:
            second_phone = request.data["second_phone"]
        except KeyError:
            second_phone = None
        try:
            contact = Contact.objects.first()

            if contact is None:
                contact = self.class_serializer(data=request.data)
            else:
                contact = self.class_serializer(contact, data=request.data)

            if second_phone:
                if first_phone == second_phone:
                    return Response(
                        {"detail": "Номери телефонів співпадають"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            if contact.is_valid():
                contact.save()
                return Response(contact.data, status=status.HTTP_200_OK)

            return Response(contact.errors, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
