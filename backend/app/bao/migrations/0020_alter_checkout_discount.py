# Generated by Django 4.1.1 on 2023-01-29 16:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bao', '0019_basket_discount_price_checkout_total_price_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='checkout',
            name='discount',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='bao.discount', verbose_name='Скидка'),
        ),
    ]
