from django.db.models.signals import post_migrate
from django.dispatch import receiver
from user_profile.models import User
from chytozavrik.settings import base

@receiver(post_migrate)
def populate_initial_data(sender, **kwargs):
    if User.objects.count() == 0:
        user = User.objects.create_superuser(
            email=base.DJANGO_SUPERUSER_EMAIL,
            password=base.DJANGO_SUPERUSER_PASSWORD,
        )
        user.save()