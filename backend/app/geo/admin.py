from django.contrib import admin
from .models import *

class CountryAdmin(admin.ModelAdmin):
  list_display = ("id", "name")
  search_fields = ("name",)

admin.site.register(Country, CountryAdmin)

class RegionAdmin(admin.ModelAdmin):
  list_display = ("id", "name")
  search_fields = ("name",)

admin.site.register(Region, RegionAdmin)

class CityAdmin(admin.ModelAdmin):
  search_fields = ("name",)
  list_display = ("id", "name", "geo_region_id")
  list_per_page = 20

  def geo_region_id(self, obj):
    return obj.geo_region.name

admin.site.register(City, CityAdmin)
