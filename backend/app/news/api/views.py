from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from utils.token import TokenAuthentication
from app.news.api.serializers import *
from app.news.models import *
from utils.permission import IsAdminUser
from app.users.api.serializers import FileUploader
from utils.function import configurate

class NewsViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminUser]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = News.objects.all()
  serializer_class = NewsSerializer
  paginate_by = 50

  def get_queryset(self):
    filter = super().get_queryset()

    return filter

  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    return Response({
      'results': data.__dict__.get('data')
    })

  def create(self, request, *args, **kwargs):
    #super().create(request, *args, **kwargs)
    data = configurate(request, News)
    
    NewsSerializer.is_validated(attrs=data)
    data['image'] = FileUploader(data['image'])
    data['user'] = request.user

    News.objects.create(**data)

    return Response({
      'results': True
    })

  def update(self, request, *args, **kwargs):
    #return super().update(request, *args, **kwargs)
    data = configurate(request)
     
    if isinstance(data['image'], InMemoryUploadedFile):
      data['image'] = FileUploader(data['image'])
    else:
      del data['image']

    News.objects.filter(pk=kwargs['pk']).update(**data)

    return Response({
      'results': True
    })

class NewsPublicViewSet(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]
  #authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = News.objects.all()
  serializer_class = NewsSerializer
  paginate_by = 50

  def get_queryset(self):
    filter = super().get_queryset()

    return filter