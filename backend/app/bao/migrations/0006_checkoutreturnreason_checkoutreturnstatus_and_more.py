# Generated by Django 4.1.1 on 2022-12-18 12:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bao', '0005_discount_event'),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckoutReturnReason',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default='', max_length=255, verbose_name='Код')),
                ('name', models.CharField(default='', max_length=255, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Причина возврата',
                'verbose_name_plural': 'Причины возврата',
            },
        ),
        migrations.CreateModel(
            name='CheckoutReturnStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default='', max_length=255, verbose_name='Код')),
                ('name', models.CharField(default='', max_length=255, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Статус возврата',
                'verbose_name_plural': 'Статусы возврата',
            },
        ),
        migrations.CreateModel(
            name='CheckouReturn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(verbose_name='Описание')),
                ('name', models.CharField(default='', max_length=255, null=True, verbose_name='Фамилия Имя Отчество')),
                ('seria_passport', models.CharField(default='', max_length=255, null=True, verbose_name='Серия паспорта')),
                ('number_passport', models.CharField(default='', max_length=255, null=True, verbose_name='Номер паспорта')),
                ('date_passport', models.DateField(default='', max_length=255, null=True, verbose_name='Дата выдачи')),
                ('given_passport', models.CharField(default='', max_length=255, null=True, verbose_name='Кем выдан')),
                ('inn_bank', models.CharField(default='', max_length=255, null=True, verbose_name='ИНН')),
                ('bik_bank', models.CharField(default='', max_length=255, null=True, verbose_name='БИК')),
                ('receipt_bank', models.CharField(default='', max_length=255, null=True, verbose_name='Расчетный счет')),
                ('korr_bank', models.CharField(default='', max_length=255, null=True, verbose_name='Корр. счет')),
                ('checkout', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bao.checkout', verbose_name='Заказ')),
                ('reason', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bao.checkoutreturnreason', verbose_name='Причина')),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bao.checkoutreturnstatus', verbose_name='Статус')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Статус')),
            ],
            options={
                'verbose_name': 'Запрос на возврат средств',
                'verbose_name_plural': 'Запросы на возврат средств',
            },
        ),
    ]
