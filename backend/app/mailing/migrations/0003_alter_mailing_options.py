# Generated by Django 4.1.1 on 2022-12-18 20:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mailing', '0002_remove_mailing_users_mailing_user_mailing_user_list_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='mailing',
            options={'verbose_name': 'Рассылка', 'verbose_name_plural': 'Рассылки'},
        ),
    ]