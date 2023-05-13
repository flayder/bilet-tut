from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

#router.register(r"api/event_price", EventPriceViewSet)


urlpatterns = [
    path("api/feedback/", FeedbackCreate.as_view()),
    #re_path(r"api/page/(?P<type>[a-z\-]+)", GetPage),
    path("api/questions/", GetQuestion)
]

urlpatterns += router.urls
