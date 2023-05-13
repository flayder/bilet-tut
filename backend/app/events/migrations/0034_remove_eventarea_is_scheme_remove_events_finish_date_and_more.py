# Generated by Django 4.1.1 on 2023-01-15 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0033_alter_eventgenre_code'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='eventarea',
            name='is_scheme',
        ),
        migrations.RemoveField(
            model_name='events',
            name='finish_date',
        ),
        migrations.RemoveField(
            model_name='events',
            name='start_date',
        ),
        migrations.AlterField(
            model_name='events',
            name='description',
            field=models.TextField(blank=True, default=None, null=True, verbose_name='Описание'),
        ),
        migrations.CreateModel(
            name='EventDate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateTimeField(verbose_name='Дата проведения')),
                ('finish_date', models.DateTimeField(verbose_name='Дата закрытия продаж')),
                ('event', models.ManyToManyField(blank=True, to='events.events', verbose_name='Дата мероприятия')),
            ],
            options={
                'verbose_name': 'Дата мероприятия',
                'verbose_name_plural': 'Дата мероприятия',
            },
        ),
        migrations.AddField(
            model_name='events',
            name='dates',
            field=models.ManyToManyField(blank=True, default=None, to='events.eventdate', verbose_name='Даты мероприятия'),
        ),
    ]
