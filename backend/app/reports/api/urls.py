from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r"api/report", ReportListView)
# router.register(r"api/report_period", ReportPeriodListView)
# router.register(r"api/report_type", ReportTypeListView)



urlpatterns = [
    #path("api/event/", EventListView.as_view()),
    #re_path(r"api/event/(?P<pk>[0-9]+)", EventDetail),
    path("api/report_period/", ReportPeriodListView.as_view()),
    path("api/report_type/", ReportTypeListView.as_view())
]

urlpatterns += router.urls
