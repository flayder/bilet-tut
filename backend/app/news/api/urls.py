from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

#router.register(r"api/user", AuthUserAuthView)
router.register(r"api/news", NewsViewSet)

urlpatterns = [
    #path("api/event/", EventListView.as_view()),
    #re_path(r"api/event/(?P<pk>[0-9]+)", EventDetail),
    path("api/news/list/", NewsPublicViewSet.as_view()),
    #path("api/user/password/change/", ChangePassword)
]

urlpatterns += router.urls