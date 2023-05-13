from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

#router.register(r"api/event_price", EventPriceViewSet)


urlpatterns = [
    #path("api/event/", EventListView.as_view()),
    re_path(r"api/page/(?P<type>[a-z\-]+)", GetPage),
    #path("api/event_area", EventAreaViewSet.as_view())
]

urlpatterns += router.urls
