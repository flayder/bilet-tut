# Generated by Django 4.1.1 on 2022-09-30 20:20

import app.images.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False, verbose_name='order')),
                ('image', models.ImageField(height_field='height', max_length=255, upload_to=app.images.models.get_realestate_photo_filename, width_field='width')),
                ('width', models.IntegerField(default=0, editable=False)),
                ('height', models.IntegerField(default=0, editable=False)),
                ('is_main', models.BooleanField(default=False)),
                ('is_deleted', models.BooleanField(default=False)),
                ('external_url', models.URLField(blank=True, max_length=255, null=True, verbose_name='Внешняя ссылка')),
            ],
            options={
                'ordering': ('order',),
                'abstract': False,
            },
        ),
    ]
