from django.db import models


class Partner(models.Model):
    img = models.ImageField(upload_to='partners/')
    link = models.URLField()
