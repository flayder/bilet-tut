# Generated by Django 4.1.1 on 2023-02-11 17:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0048_remove_events_type_events_type'),
        ('design', '0003_alter_rubric_image_alter_slider_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='slider',
            name='event',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='events.events', verbose_name='Мероприятие'),
        ),
        migrations.AddField(
            model_name='slider',
            name='type',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='events.eventtype', verbose_name='Тип мероприятия'),
        ),
    ]
