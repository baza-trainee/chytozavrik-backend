from django.db import models
from user_profile.models import Child


class MonthlyActiveChild(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    year = models.IntegerField()
    month = models.IntegerField()
    is_active = models.BooleanField(default=False)
