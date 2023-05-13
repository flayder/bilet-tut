from django.urls import path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

#router.register(r"country", CountryViewSet)

urlpatterns = [
    #path("api/event/", EventListView.as_view()),
    #re_path(r"api/event/(?P<pk>[0-9]+)", EventDetail),
    path("api/geo/country", CountryViewSet.as_view()),
    path("api/geo/city", CityViewSet.as_view())
]

urlpatterns += router.urls
