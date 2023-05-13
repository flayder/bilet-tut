from django.contrib import admin
from .models import *

class ImageAdmin(admin.ModelAdmin):
  list_display = ("id", "image_tag",)
  readonly_fields = ("image_tag",)
  search_fields = ("image",)

  def get_result_value(self, result):
    print('result', result)

admin.site.register(Image, ImageAdmin)
