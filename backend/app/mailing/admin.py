from django.contrib import admin
from app.mailing.models import *

class MailingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type")
    autocomplete_fields = ['event']
    

admin.site.register(Mailing, MailingAdmin)
