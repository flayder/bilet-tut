# Generated by Django 4.1.1 on 2023-03-20 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bao', '0027_alter_eventcheckin_checkout_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkout',
            name='bank_field',
            field=models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='Заметка банка'),
        ),
    ]
