from django.db.models.signals import post_migrate
from django.dispatch import receiver
from contacts.models import Contact


@receiver(post_migrate)
def populate_initial_data(sender, **kwargs):
    if Contact.objects.count() == 0:
        contact = Contact.objects.create(
            first_phone="+380951111111",
            second_phone="+380951111112",
            email="user@example.com",
        )
        contact.save()
