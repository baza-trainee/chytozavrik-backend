import os
import shutil

from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.core.files import File

from user_profile.models import ChildAvatar, User
from chytozavrik.settings import base


@receiver(post_migrate)
def populate_initial_data(sender, **kwargs):
    if User.objects.count() == 0:
        user = User.objects.create_superuser(
            email=base.DJANGO_SUPERUSER_EMAIL,
            password=base.DJANGO_SUPERUSER_PASSWORD,
        )
        user.save()
    else:
        print(f"User is already exists.")

    if ChildAvatar.objects.count() == 0:
        folder_to_delete = "media"
        if os.path.exists(folder_to_delete):
            try:
                shutil.rmtree(folder_to_delete)
                print(f"Папка {folder_to_delete} успішно видалена.")
            except Exception as e:
                print(f"Помилка при видаленні папки {folder_to_delete}: {e}")

        avatars_folder = os.path.join("static", "child_avatars")
        avatar_files = os.listdir(avatars_folder)
        for file_name in avatar_files:
            with open(os.path.join(avatars_folder, file_name), "rb") as f:
                ChildAvatar.objects.create(avatar=File(f, name=file_name))
            print(f"Created '{file_name}'.")
    else:
        print(f"Avatars is already exists.")
