from django.contrib import admin

from .models import *

class UserAdmin(admin.ModelAdmin):
  search_fields = ("username", "surname", "email", "login")

admin.site.register(User, UserAdmin)

class UserCheckerAdmin(admin.ModelAdmin):
  search_fields = ("username", "surname", "email", "login")

admin.site.register(UserChecker, UserCheckerAdmin)
