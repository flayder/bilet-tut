# Generated by Django 4.1.1 on 2022-12-18 12:15

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bao', '0006_checkoutreturnreason_checkoutreturnstatus_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CheckouReturn',
            new_name='CheckoutReturn',
        ),
    ]