# Generated by Django 4.1.1 on 2022-11-10 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_user_abilet'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='lastname',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Отчество'),
        ),
    ]
