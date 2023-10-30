from django.db import models


class Partner(models.Model):
    name = models.CharField(max_length=255)
    img = models.ImageField(upload_to='partners/')
    link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('name', 'link'),)