import os

from django.core.files import File
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from documents.models import Document


@receiver(post_migrate)
def populate_initial_data(sender, **kwargs):
    if Document.objects.count() == 0:
        documents_folder = os.path.join("static", "documents")
        document_files = os.listdir(documents_folder)
        doc_names = ["Політика конфіденційності", "Правила користування сайтом"]
        for number, file_name in enumerate(document_files):
            with open(os.path.join(documents_folder, file_name), "rb") as f:
                Document.objects.create(
                    name=doc_names[number], file=File(f, name=file_name)
                )
                print(f"Created '{file_name}'.")

    else:
        print(f"Document is already exists.")
