# Generated by Django 4.2.3 on 2024-01-13 08:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user_profile", "0004_alter_childavatar_avatar"),
    ]

    operations = [
        migrations.AlterField(
            model_name="childavatar",
            name="avatar",
            field=models.FileField(upload_to="child_avatars/"),
        ),
    ]
