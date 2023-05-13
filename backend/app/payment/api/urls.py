from rest_framework import routers
from django.urls import path, re_path
from .views import *

router = routers.DefaultRouter()

router.register(r"api/payment", PaymentViewSet)

urlpatterns = [
    path("api/sberbank/callback_fun/", SberCallBack),
    path("api/mail/", SberPay),
    #re_path(r"api/basket/(?P<pk>[0-9]+)/", RemoveItem),
]

urlpatterns += router.urls