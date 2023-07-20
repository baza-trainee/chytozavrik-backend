from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import UserManager


class User(AbstractUser):
    username = None
    first_name = None
    last_name = None
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()
