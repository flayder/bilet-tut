# Generated by Django 4.1.1 on 2022-12-27 19:19

from django.db import migrations, models
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
        ('page', '0002_page_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='elementpage',
            name='field',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Поле для ввода'),
        ),
        migrations.AlterField(
            model_name='elementpage',
            name='html_field',
            field=tinymce.models.HTMLField(blank=True, null=True, verbose_name='HTML поле для ввода'),
        ),
        migrations.AlterField(
            model_name='page',
            name='seo_description',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Сео описание'),
        ),
        migrations.AlterField(
            model_name='page',
            name='seo_title',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Сео заголовок'),
        ),
    ]
