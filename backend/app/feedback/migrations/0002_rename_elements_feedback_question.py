# Generated by Django 4.1.1 on 2022-12-29 17:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='feedback',
            old_name='elements',
            new_name='question',
        ),
    ]
