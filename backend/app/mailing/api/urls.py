from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r"api/mailing", MailingView)



urlpatterns = [
    #path("api/event/", EventListView.as_view()),
    #re_path(r"api/event/(?P<pk>[0-9]+)", EventDetail),
    #path("api/event_area", EventAreaViewSet.as_view())
]

urlpatterns += router.urls
