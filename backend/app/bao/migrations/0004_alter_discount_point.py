# Generated by Django 4.1.1 on 2022-12-13 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bao', '0003_alter_checkout_options_alter_checkout_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='discount',
            name='point',
            field=models.CharField(choices=[('percent', 'Процент'), ('cash', 'Точная сумма')], max_length=255, verbose_name='Тип скидки'),
        ),
    ]
