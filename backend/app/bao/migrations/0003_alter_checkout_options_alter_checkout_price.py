# Generated by Django 4.1.1 on 2022-11-04 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bao', '0002_alter_basket_ordered'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='checkout',
            options={'verbose_name': 'Заказ', 'verbose_name_plural': 'Заказы'},
        ),
        migrations.AlterField(
            model_name='checkout',
            name='price',
            field=models.IntegerField(default=0, verbose_name='Цена заказа в сумме'),
        ),
    ]
