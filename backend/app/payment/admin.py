from django.contrib import admin
from .models import *

class PaymentAdmin(admin.ModelAdmin):
  search_fields = ("name",)

admin.site.register(Payment, PaymentAdmin)
