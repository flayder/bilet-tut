from django.contrib import admin
from .models import *

class SliderAdmin(admin.ModelAdmin):
  list_display = ("id", "name", "position", "is_banner", "title", "subtitle", "date")
  search_fields = ("name",)

admin.site.register(Slider, SliderAdmin)


class RubricAdmin(admin.ModelAdmin):
  list_display = ("id", "name", "position")
  search_fields = ("name",)

admin.site.register(Rubric, RubricAdmin)
