# Generated by Django 4.1.1 on 2023-01-20 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0038_eventareaschems_categories_eventareaschems_dates'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventareaplaces',
            name='scheme',
            field=models.ManyToManyField(blank=True, default=None, to='events.eventareaschems', verbose_name='Схема'),
        ),
    ]
