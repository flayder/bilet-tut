from django.urls import path, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()


router.register(r"api/user", AuthUserAuthView)
router.register(r"api/user_checker", UserCheckerViewSet)

#admin
router.register(r"api/admin_user", AdminUserViewSet)

urlpatterns = [
    #path("api/event/", EventListView.as_view()),
    re_path(r"api/user/get_user/(?P<pk>[0-9]+)/", NoViewerUserViewSet.as_view()),
    re_path(r"api/user/admin_user_update/(?P<pk>[0-9]+)/", NoViewerUserUpdate.as_view()),
    
    re_path(r"api/user/activate/(?P<pk>[0-9]+)/", ActivateAccount),
    re_path(r"api/user/sms_code/(?P<pk>[0-9]+)/", SendSms),

    re_path(r"api/user/check_sms/(?P<pk>[0-9]+)/", CheckSms),

    path("api/user/current/", GetCurrentUser),

    path("api/user/telegram_auth/", TelegramAuth),
    path("api/user/vk_auth/", VKAuth),

    path("api/user/password/change/", ChangePassword),
    path("api/user/password/recovery_phone/", RecoveryPhone),
    path("api/user/password/recovery/", RecoveryFirst),
    path("api/user/password/recovery_second/", RecoverySecond),
    #mobile app
    path("api/userchecker/auth/", AuthChecker),
    path("api/userchecker/current_user/", GetCurrentChecker),
    path("api/userchecker/restore_pass/", AuthRestoreChecker)
]

urlpatterns += router.urls
