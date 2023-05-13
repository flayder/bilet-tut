from rest_framework import status
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from app.reports.models import *
from app.reports.api.serializers import *
from app.geo.models import *
from django.db.models import Q
from utils.token import TokenAuthentication
from django.db import models as django_models
from django_filters import rest_framework as filtering
from rest_framework import viewsets
from users.api.serializers import FileUploader

class ReportListView(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["start_date", "id"]
  filterset_fields = ['period', 'type', 'user']

  queryset = Reports.objects.all()
  serializer_class = ReportsSerializer
  paginate_by = 20

  def get_serializer_context(self):
     return {'user': self.request.user}

  
  def get_queryset(self):
    filter = super().get_queryset()
    return filter

  def create(self, request, *args, **kwargs):
    data = request.data
    validate = ReportsSerializer(data=data)
    try:
      type = ReportType.objects.get(pk=data['type'])
      period = ReportPeriod.objects.get(pk=data['period'])
      data['type'] = type
      data['period'] = period
      data['user'] = request.user
      Reports.objects.create(**data)
    except Exception as e:
      print('error', e)
      validate.is_valid(raise_exception=True)

    return Response({
      'results': True
    })

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = ReportsSerializer(data=data)
    
    try:
      Reports.objects.filter(pk=kwargs.get('pk')).update(**data)
    except Exception as e:
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })
      

  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    
    return Response({
      'results': item.data
    })


class ReportTypeListView(generics.ListAPIView):
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  authentication_classes = [TokenAuthentication]

  queryset = ReportType.objects.all()
  serializer_class = ReportTypeSerializer
  paginate_by = 20

class ReportPeriodListView(generics.ListAPIView):
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  authentication_classes = [TokenAuthentication]

  queryset = ReportPeriod.objects.all()
  serializer_class = ReportPeriodSerializer
  paginate_by = 20