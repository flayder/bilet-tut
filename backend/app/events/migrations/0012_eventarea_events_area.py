# Generated by Django 4.1.1 on 2022-10-17 17:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0011_alter_events_finish_date_alter_events_start_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventArea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=255, verbose_name='Код площадки мероприятия')),
                ('name', models.CharField(max_length=255, verbose_name='Количество плоащадки мероприятия')),
            ],
            options={
                'verbose_name': 'Плоащадки мероприятия',
                'verbose_name_plural': 'Плозадка мероприятия',
            },
        ),
        migrations.AddField(
            model_name='events',
            name='area',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='events.eventarea', verbose_name='Площадка'),
        ),
    ]
