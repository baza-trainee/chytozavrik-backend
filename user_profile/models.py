from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import UserManager


class User(AbstractUser):
    username = None
    first_name = None
    last_name = None
    email = models.EmailField(
        unique=True,
    )
    date_joined = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()


class ChildAvatar(models.Model):
    avatar = models.FileField(upload_to="child_avatars/")

    def __str__(self):
        return str(self.avatar)


class Child(models.Model):
    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="children")
    avatar = models.ForeignKey(ChildAvatar, on_delete=models.RESTRICT)
    name = models.TextField(max_length=100)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"
