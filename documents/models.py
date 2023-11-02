from django.db import models


class Document(models.Model):
    name = models.CharField(max_length=255, unique=True)
    file = models.BinaryField()
    updated_at = models.DateTimeField(auto_now=True)
