from django.contrib import admin
from .models import *

class LoggingAdmin(admin.ModelAdmin):
  list_display = ("id", "action", "user")
  search_fields = ("action",)

admin.site.register(Logging, LoggingAdmin)
