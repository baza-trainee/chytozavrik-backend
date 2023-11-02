import os
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from documents.models import Document


@receiver(post_migrate)
def populate_initial_data(sender, **kwargs):
    if Document.objects.count() == 0:
        for file_name in ["Політика конфіденційності", "Правила користування сайтом"]:
            with open(f"static/documents/{file_name}.pdf", "rb") as f:
                binary_file = f.read()
                Document.objects.create(name=file_name, file=binary_file)
