# Generated by Django 4.1.1 on 2022-12-10 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0024_alter_eventprice_place'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventareacategory',
            name='description',
            field=models.TextField(default='', verbose_name='Описание'),
        ),
    ]
