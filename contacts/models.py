from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from django.core.exceptions import ValidationError
from phonenumber_field.phonenumber import PhoneNumber, to_python


def custom_validate_international_phonenumber(value):
    phone_number = to_python(value)
    if isinstance(phone_number, PhoneNumber) and not phone_number.is_valid():
        raise ValidationError(
            "Некоректне значення для номеру телефону.", code="invalid_phone_number"
        )


class CustomPhoneNumberField(PhoneNumberField):
    default_validators = [custom_validate_international_phonenumber]


class Contact(models.Model):
    first_phone = CustomPhoneNumberField(null=False, blank=False)
    second_phone = CustomPhoneNumberField(null=True, blank=True)
    email = models.EmailField()
    updated_at = models.DateTimeField(auto_now=True)
