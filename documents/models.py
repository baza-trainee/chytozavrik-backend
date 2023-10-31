from django.db import models
from django.db import models
from django.core.files.storage import FileSystemStorage


class Document(models.Model):
    name = models.CharField(max_length=255, unique=True)
    file = models.FileField(upload_to="documents/", storage=FileSystemStorage())
    updated_at = models.DateTimeField(auto_now=True)
