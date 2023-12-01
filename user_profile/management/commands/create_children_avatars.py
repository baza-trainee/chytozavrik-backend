import os
from django.core.management.base import BaseCommand
from django.conf import settings

from ...models import ChildAvatar

MEDIA_ROOT = getattr(settings, "MEDIA_ROOT")


class Command(BaseCommand):
    help = (
        "Create instances for avatars from media/avatars/ if they do not already exist."
    )

    def handle(self, *args, **options):
        avatars_folder = os.path.join(MEDIA_ROOT, "children's-avatars")
        avatar_files = os.listdir(avatars_folder)

        # for file_name in avatar_files:
        #     # Check if an instance with this avatar already exists
        #     if ChildAvatar.objects.filter(avatar__endswith=file_name).exists():
        #         self.stdout.write(
        #             self.style.WARNING(
        #                 f"Skipping '{file_name}' as an instance with this avatar already exists."
        #             )
        #         )
        #     else:
        #         instance = ChildAvatar(
        #             avatar=os.path.join("children's-avatars", file_name)
        #         )
        #         instance.save()
        #         self.stdout.write(
        #             self.style.SUCCESS(
        #                 f"Created instance for '{file_name}' and linked to existing avatar."
        #             )
        #         )
