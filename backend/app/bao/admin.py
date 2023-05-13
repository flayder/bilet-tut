from django.contrib import admin
from .models import *

class DiscountAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "event", "start_date", "finish_date")
    search_fields = ["id", "name", "event", "user"]
    

admin.site.register(Discount, DiscountAdmin)

class BasketAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "quantity", "ordered")
    search_fields = ["id", "ordered"]
    autocomplete_fields = ["product", "user"]
    

admin.site.register(Basket, BasketAdmin)

class OrderAdmin(admin.ModelAdmin):
  list_display = ("id", "user", "discount", "price")
  search_fields = ["id"]
  autocomplete_fields = ["products"]
  
  def price(self, checkout):
    return 0
    
admin.site.register(Checkout, OrderAdmin)

class OrderStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "name")
    

admin.site.register(CheckoutStatus, OrderStatusAdmin)

class CheckoutReturnStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "name")
    

admin.site.register(CheckoutReturnStatus, CheckoutReturnStatusAdmin)

class CheckoutReturnReasonAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "name")
    

admin.site.register(CheckoutReturnReason, CheckoutReturnReasonAdmin)

class CheckoutReturnAdmin(admin.ModelAdmin):
    list_display = ("id", "checkout", "user",)
    

admin.site.register(CheckoutReturn, CheckoutReturnAdmin)

class EventCheckinStatusAdmin(admin.ModelAdmin):
  list_display = ("id", "name",)
  ordering = ("id",)
  search_fields = ("name",)

admin.site.register(EventCheckinStatus, EventCheckinStatusAdmin)

class EventCheckinAdmin(admin.ModelAdmin):
  list_display = ("id", "checker", "checkout")
  ordering = ("id",)
  search_fields = ("checker",)
  autocomplete_fields = ("checkout", "checker")

admin.site.register(EventCheckin, EventCheckinAdmin)