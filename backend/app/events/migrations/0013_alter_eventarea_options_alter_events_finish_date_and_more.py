# Generated by Django 4.1.1 on 2022-10-22 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0012_eventarea_events_area'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='eventarea',
            options={'verbose_name': 'Площадка мероприятия', 'verbose_name_plural': 'Площадки мероприятия'},
        ),
        migrations.AlterField(
            model_name='events',
            name='finish_date',
            field=models.DateTimeField(verbose_name='Дата закрытия продаж'),
        ),
        migrations.AlterField(
            model_name='events',
            name='start_date',
            field=models.DateTimeField(verbose_name='Дата проведения'),
        ),
    ]
