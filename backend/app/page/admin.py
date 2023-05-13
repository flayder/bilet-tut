from django.contrib import admin
from .models import *

class ElementPageAdmin(admin.ModelAdmin):
  list_display = ("id", "field")
  search_fields = ("id", "field")

admin.site.register(ElementPage, ElementPageAdmin)

class PageAdmin(admin.ModelAdmin):
  list_display = ("id", "h1", "content")
  autocomplete_fields = ["elements"]
  ordering = ("h1",)
  search_fields = ("h1", "content")

admin.site.register(Page, PageAdmin)

