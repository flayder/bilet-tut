# Generated by Django 4.1.1 on 2022-10-16 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0009_eventtype_events_is_expected_events_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='for_child',
            field=models.BooleanField(default=False, verbose_name='Для детей'),
        ),
    ]
