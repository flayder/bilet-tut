from django.contrib import admin
from .models import *

class SpecialAdmin(admin.ModelAdmin):
  list_display = ("id", "name")
  search_fields = ("name",)

admin.site.register(Special, SpecialAdmin)
