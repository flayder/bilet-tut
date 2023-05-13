from django.contrib import admin
from .models import *

class QuestionAdmin(admin.ModelAdmin):
  list_display = ("id", "name")
  search_fields = ("id", "name")

admin.site.register(Questions, QuestionAdmin)

class FeedbackAdmin(admin.ModelAdmin):
  list_display = ("id", "theme", "email")
  #autocomplete_fields = ["quest"]
  ordering = ("theme",)
  search_fields = ("theme", "email", "name")

admin.site.register(Feedback, FeedbackAdmin)

