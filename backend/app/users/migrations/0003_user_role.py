# Generated by Django 4.1.1 on 2022-10-26 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_options_user_birthday_user_surname_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('admin', 'Админ'), ('viewer', 'Зритель'), ('manager', 'Организатор')], default='viewer', max_length=255, verbose_name='Роль пользователя'),
        ),
    ]
