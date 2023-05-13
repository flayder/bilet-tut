from django.contrib import admin
from .models import *
from .form import *


class EventPriceAdmin(admin.ModelAdmin):
  list_display = ("id", "price", "color", "raising", "date_to", "user")
  search_fields = ("name",)

  def user(self, event):
    user = event.get_user()
    if user:
      return user.login
    return None


admin.site.register(EventPrice, EventPriceAdmin)


class EventAreaPlaceAdmin(admin.ModelAdmin):
  list_display = ("id", "name", "row")
  ordering = ("name",)
  search_fields = ("name", "row")

admin.site.register(EventAreaPlaces, EventAreaPlaceAdmin)


class EventAreaSchemeAdmin(admin.ModelAdmin):
  list_display = ("id", "name", "schem")
  #form = EventAreaSchemsForm

admin.site.register(EventAreaSchems, EventAreaSchemeAdmin)

class EventPromotionAdmin(admin.ModelAdmin):
  list_display = ("id", "name", "event", "user")
  #form = EventAreaSchemsForm

admin.site.register(EventPromotion, EventPromotionAdmin)


class EventAreaCategoryAdmin(admin.ModelAdmin):
  list_display = ("id", "name", "user", "price")
  autocomplete_fields = ["user"]
  # ordering = ("name",)
  search_fields = ("name", "id")

admin.site.register(EventAreaCategory, EventAreaCategoryAdmin)

class EventTypeAdmin(admin.ModelAdmin):
  list_display = ("id", "name",)
  ordering = ("name",)
  search_fields = ("name",)

admin.site.register(EventType, EventTypeAdmin)

class EventGenreAdmin(admin.ModelAdmin):
  list_display = ("id", "name",)
  ordering = ("name",)
  search_fields = ("name",)

admin.site.register(EventGenre, EventGenreAdmin)

class EventStatusAdmin(admin.ModelAdmin):
  list_display = ("id", "name",)
  ordering = ("name",)
  search_fields = ("name",)

admin.site.register(EventStatus, EventStatusAdmin)

class EventAgeAdmin(admin.ModelAdmin):
  list_display = ("id", "name",)
  ordering = ("id",)
  search_fields = ("name",)

admin.site.register(EventAge, EventAgeAdmin)

class EventAreaAdmin(admin.ModelAdmin):
  form = EventAreaForm
  list_display = ("id", "name",)
  ordering = ("id",)
  search_fields = ("name",)
  autocomplete_fields = ("city",)

admin.site.register(EventArea, EventAreaAdmin)

class EventAdmin(admin.ModelAdmin):
  #form = EventForm
  list_display = ("id", "name", "user") 
  search_fields = ["id", "area", "afisha"]
  autocomplete_fields = ('user', 'area', 'afisha', 'preview', 'genre', 'payment', 'city')

  # def start_date(self, val):
  #   print('date', val)

admin.site.register(Events, EventAdmin)

class EventDateAdmin(admin.ModelAdmin):
  list_display = ("id", "start_date", "finish_date",)
  ordering = ("id",)
  search_fields = ("start_date", "finish_date")

admin.site.register(EventDate, EventDateAdmin)


class EventMailTemplateAdmin(admin.ModelAdmin):
  list_display = ('id', 'is_attention', 'is_returning', 'is_description', 'user')
  ordering = ("id",)
  search_fields = ['id']

admin.site.register(EventMailTemplate, EventMailTemplateAdmin)