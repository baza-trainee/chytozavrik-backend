import os

from django.core.management.base import BaseCommand
from django.core.files import File

from ...models import ChildAvatar


class Command(BaseCommand):
    help = (
        "Create instances for avatars from media/avatars/ if they do not already exist."
    )

    def handle(self, *args, **options):
        avatars_folder = os.path.join("static", "child_avatars")
        avatar_files = os.listdir(avatars_folder)

        if ChildAvatar.objects.count() >= 1:
            self.stdout.write(self.style.WARNING(f"Avatar is already exists."))
        else:
            for file_name in avatar_files:
                # Check if an instance with this avatar already exists
                # instance = ChildAvatar(
                #     avatar=os.path.join("child-avatars", file_name)
                # )
                # instance.save()
                with open(os.path.join(avatars_folder, file_name), "rb") as f:
                    ChildAvatar.objects.create(avatar=File(f))
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created instance for '{file_name}' and linked to existing avatar."
                    )
                )
