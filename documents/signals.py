import os

from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.core.files import File

from documents.models import Document
from chytozavrik.settings.base import MEDIA_URL


@receiver(post_migrate)
def populate_initial_data(sender, **kwargs):
    if Document.objects.count() == 0:
        media_directory = MEDIA_URL + "/documents"
        try:
            for filename in os.listdir(media_directory):
                file_path = os.path.join(media_directory, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
        except Exception:
            pass
        with open(f"static/documents/blank.pdf", "rb") as f:
            Document.objects.create(
                name="Політика конфіденційності",
                file=File(f, name="privacy_policy.pdf"),
            )
            Document.objects.create(
                name="Правила користування сайтом", file=File(f, name="site_rules.pdf")
            )
