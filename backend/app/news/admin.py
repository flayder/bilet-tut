from django.contrib import admin
from .models import *

class NewsAdmin(admin.ModelAdmin):
  list_display = ("id", "title", "subtitle")
  search_fields = ("title", "subtitle", "content")

admin.site.register(News, NewsAdmin)
