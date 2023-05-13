from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from utils.token import TokenAuthentication
from app.logging.api.serializers import *
from app.logging.models import *
from utils.permission import IsAdminUser

class LoggingViewSet(generics.ListAPIView):
  permission_classes = [IsAdminUser]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = Logging.objects.all()
  serializer_class = LoggingSerializer
  paginate_by = 50

  def get_queryset(self):
    filter = super().get_queryset()

    role = self.request.GET.get('user__role')

    date_from = self.request.GET.get('date_from')
    date_to = self.request.GET.get('date_to')
    time = self.request.GET.get('time')

    if role:
      filter = filter.filter(user__role=role)

    if date_from:
      if time:
        date_from = f"{date_from} {time}"

      filter = filter.filter(date__gte=date_from)

    if date_to:
      if time:
        date_to = f"{date_to} {time}"

      filter = filter.filter(date__lte=date_to)

    return filter