# Generated by Django 4.1.1 on 2023-04-03 21:42

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0054_eventpromotion_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
