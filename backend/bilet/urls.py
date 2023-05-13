from django.conf.urls import include
from django.contrib import admin
from django.urls import path, re_path
from app.geo.api.urls import urlpatterns as country_router
from app.users.api.urls import urlpatterns as user_router
from app.events.api.urls import urlpatterns as event_router
from app.bao.api.urls import urlpatterns as bao_router
from app.payment.api.urls import urlpatterns as payment_router
from app.mailing.api.urls import urlpatterns as mailing_router
from app.feedback.api.urls import urlpatterns as feedback_router
from app.page.api.urls import urlpatterns as page_router
from app.logging.api.urls import urlpatterns as logging_router
from app.news.api.urls import urlpatterns as news_router
from app.special.api.urls import urlpatterns as special_router
from app.design.api.urls import urlpatterns as design_router
from app.reports.api.urls import urlpatterns as report_router
from app.users.api.views import RegisterView
from app.images.views import ImageAutocomplete
from app.payment.views import bilet_pdf

urlpatterns = [
  path('bilet/pdf/', bilet_pdf),
  path('image-autocomplete/', ImageAutocomplete.as_view(), name='image-autocomplete'),
  re_path(r'', include((country_router, 'api_geo'), namespace='api_geo')),
  re_path(r'', include((user_router, 'api_user'), namespace='api_user')),
  re_path(r'', include((event_router, 'api_event'), namespace='api_event')),
  re_path(r'', include((bao_router, 'api_bao'), namespace='api_bao')),
  re_path(r'', include((payment_router, 'api_payment'), namespace='api_payment')),
  re_path(r'', include((mailing_router, 'api_mailing'), namespace='api_mailing')),
  re_path(r'', include((feedback_router, 'api_feedback'), namespace='api_feedback')),
  re_path(r'', include((page_router, 'api_page'), namespace='api_page')),
  re_path(r'', include((logging_router, 'api_logging'), namespace='api_logging')),
  re_path(r'', include((news_router, 'api_news'), namespace='api_news')),
  re_path(r'', include((report_router, 'api_reports'), namespace='api_reports')),
  re_path(r'', include((special_router, 'api_special'), namespace='api_special')),
  re_path(r'', include((design_router, 'api_design'), namespace='api_design')),
  re_path(r'api/user/register', RegisterView.as_view(), name='api_user_user-register'),
  path('admin/', admin.site.urls),
]
