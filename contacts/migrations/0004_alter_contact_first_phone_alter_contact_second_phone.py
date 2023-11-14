# Generated by Django 4.2.3 on 2023-11-10 12:20

import contacts.models
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("contacts", "0003_remove_contact_current_date_contact_updated_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contact",
            name="first_phone",
            field=contacts.models.CustomPhoneNumberField(max_length=128, region=None),
        ),
        migrations.AlterField(
            model_name="contact",
            name="second_phone",
            field=contacts.models.CustomPhoneNumberField(
                blank=True, max_length=128, null=True, region=None
            ),
        ),
    ]