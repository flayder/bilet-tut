# Generated by Django 4.1.1 on 2022-11-03 19:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bao', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='basket',
            name='ordered',
            field=models.IntegerField(default=0, verbose_name='Товар принадлежит к заказу'),
        ),
    ]
