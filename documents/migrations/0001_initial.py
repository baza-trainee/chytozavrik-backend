# Generated by Django 4.2.3 on 2023-10-31 17:36

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('file', models.FileField(storage=django.core.files.storage.FileSystemStorage(), upload_to='documents/')),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
