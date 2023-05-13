from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r"api/admin_slider", SliderViewSet)
router.register(r"api/admin_rubric", RubricViewSet)

urlpatterns = [
    #path("api/event/", EventListView.as_view()),
    #re_path(r"api/event/(?P<pk>[0-9]+)", EventDetail),
    path("api/slider/", SliderListViewSet.as_view()),
    path("api/rubric/", RubricListViewSet.as_view())
]

urlpatterns += router.urls