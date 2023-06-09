# Generated by Django 4.1.1 on 2023-01-10 20:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('images', '0004_fileorimage'),
        ('design', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rubric',
            name='image',
            field=models.ForeignKey(blank=None, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='images.image', verbose_name='Изображение'),
        ),
        migrations.AlterField(
            model_name='slider',
            name='image',
            field=models.ForeignKey(blank=None, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='images.image', verbose_name='Изображение'),
        ),
    ]
