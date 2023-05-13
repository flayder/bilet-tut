from django.contrib import admin
from .models import *

class ReportTypeAdmin(admin.ModelAdmin):
  search_fields = ("name", "code")

admin.site.register(ReportType, ReportTypeAdmin)

class ReportPeriodAdmin(admin.ModelAdmin):
  search_fields = ("name", "code")

admin.site.register(ReportPeriod, ReportPeriodAdmin)

class ReportAdmin(admin.ModelAdmin):
  search_fields = ("type__name", "period__date")

admin.site.register(Reports, ReportAdmin)
