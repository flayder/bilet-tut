# Generated by Django 4.1.1 on 2023-04-23 21:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0058_alter_eventprice_raising'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='events',
            name='type',
        ),
        migrations.AddField(
            model_name='events',
            name='type',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='events.eventtype', verbose_name='Тип'),
        ),
    ]