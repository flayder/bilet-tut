# Generated by Django 4.1.1 on 2023-02-11 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0048_remove_events_type_events_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='events',
            name='type',
            field=models.ManyToManyField(blank=True, default=None, to='events.eventtype', verbose_name='Тип'),
        ),
    ]
