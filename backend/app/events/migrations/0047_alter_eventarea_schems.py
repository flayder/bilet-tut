# Generated by Django 4.1.1 on 2023-02-09 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0046_eventareacategory_is_deleted_eventdate_is_deleted_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventarea',
            name='schems',
            field=models.ManyToManyField(blank=True, default=None, to='events.eventareaschems', verbose_name='Схемы зала'),
        ),
    ]
