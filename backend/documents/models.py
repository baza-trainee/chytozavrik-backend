from django.db import models


class Document(models.Model):
    name = models.CharField(max_length=255, unique=True)
    file = models.FileField(upload_to="documents/")
    updated_at = models.DateTimeField(auto_now=True)
