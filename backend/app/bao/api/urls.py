from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r"api/discount", DiscountViewSet)
router.register(r"api/checkout_return", CheckoutReturnView)
router.register(r"api/event_checkin", EventCheckerViewSet)

#mob api
router.register(r"api/userchecker/checkout", CheckOutCheckerView)

#admin
router.register(r"api/admin_basket", AdminBasketViewSet)

urlpatterns = [
    path("api/basket/", BasketListView),
    path("api/basket/add/", AddBasket),
    path("api/set_discount/", SetDiscountView),
    re_path(r"api/basket/(?P<pk>[0-9]+)/", RemoveItem),
    re_path(r"api/basket_user/(?P<pk>[0-9]+)/", GetUserCheckoutsView),
    
    path("api/checkout/", AddCheckOut),
    path("api/checkout_status/", CheckoutReturnStatusListView.as_view()),
    path("api/checkout_reason/", CheckoutReturnReasonListView.as_view()),
    path("api/account/checkout/", CheckOutView.as_view()),
    path("api/account/orders/", GetCheckoutBasketItemsView),
    re_path(r"api/repeat_bilets/(?P<pk>[0-9]+)/", RepeatBilets),
    re_path(r"api/refund_order/(?P<pk>[0-9]+)/", RefundOrder),
    re_path(r"api/checkout_user/(?P<pk>[0-9]+)/", GetUserCheckoutListView),
    re_path(r"api/pay_static/(?P<pk>[0-9]+)/", PayStaticView),
    re_path(r"api/account/checkout/(?P<pk>[0-9]+)/", RepeatCheckOutView),

    #mobile api
    path("api/userchecker/check_bilet/", CheckBilet),
    path("api/userchecker/statistic/", GetStatisticInfo),
    #path("api/userchecker/checkout/", CheckOutCheckerView),
]

urlpatterns += router.urls
