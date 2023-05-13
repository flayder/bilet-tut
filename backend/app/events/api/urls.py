from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r"api/event_price", EventPriceViewSet)
router.register(r"api/event_area", EventAreaViewSet)
router.register(r"api/event_type", EventTypeViewSet)
router.register(r"api/event_area_category", EventAreaCategoryViewSet)
router.register(r"api/event", EventListView)
router.register(r"api/event_place", EventPlaceListView)
router.register(r"api/event_mail_template", EventMailTemplateSet)

router.register(r"api/admin_event_date", EventDateView)
router.register(r"api/admin_event_promotion", EventPromotionView)
router.register(r"api/admin_event_genre", EventGenreAdminViewSet)



urlpatterns = [
    path("api/event/org_manager/", OrgSchemeManagerView),
    path("api/event/sell_info/", SellInfoManagerView),
    re_path(r"api/event/update/(?P<pk>[0-9]+)", UpdateEvent),
    path("api/event/add/", CreateEvent),
    path("api/event/favorite/", EventFavoriteView),
    path("api/event/favorite/list/", FavoriteView),
    path("api/event_status", EventStatusListView.as_view()),
    path("api/event_genre", EventGenreViewSet.as_view()),
    path("api/event_age", EventAgeViewSet.as_view()),
    path("api/event_date/", EventDateListView.as_view()),
    path("api/event_promotion/", EventPromotionListView.as_view()),
    #path("api/event_area", EventAreaViewSet.as_view())
]

urlpatterns += router.urls
