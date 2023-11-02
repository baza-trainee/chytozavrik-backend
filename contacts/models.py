from django.db import models
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField


class Contact(models.Model):
    first_phone = PhoneNumberField(null=False, blank=False)
    second_phone = PhoneNumberField(null=True, blank=True)
    email = models.EmailField()
    current_date = models.DateField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk and Contact.objects.exists():
            # if you'll not check for self.pk
            # then error will also be raised in the update of exists model
            raise ValidationError("There is can be only one contact instance")
        return super().save(*args, **kwargs)
