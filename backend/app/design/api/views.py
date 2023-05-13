from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from utils.token import TokenAuthentication
from app.design.api.serializers import *
from app.design.models import *
from utils.permission import IsAdminUser
from utils.function import configurate
import json

class SliderListViewSet(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'
  ordering = ['position']

  queryset = Slider.objects.all()
  serializer_class = SliderSerializer
  paginate_by = 50

  def get_queryset(self):
    filter = super().get_queryset()

    if not self.request.user.is_authenticated or self.request.user.is_authenticated and self.request.user.role != 'admin':
      filter = filter.filter(date__gt=datetime.datetime.now())

    return filter


class SliderViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminUser]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = Slider.objects.all()
  serializer_class = SliderSerializer
  paginate_by = 50

  def get_queryset(self):
    filter = super().get_queryset()

    if not self.request.user.is_authenticated or self.request.user.is_authenticated and self.request.user.role != 'admin':
      filter = filter.filter(date__gt=datetime.datetime.now())

    return filter

  def create(self, request, *args, **kwargs):
    #super().create(request, *args, **kwargs)
    data = configurate(request, Slider)
    

    SliderSerializer.is_validated(attrs=data)
    
    if isinstance(data['image'], InMemoryUploadedFile):
      data['image'] = FileUploader(data['image'])

    if request.data.get('type'):
      try:
        data['type'] = EventType.objects.get(pk=data['type'])
      except Exception:
        pass

    if request.data.get('event'):
      try:
        data['event'] = Events.objects.get(pk=data['event'])
      except Exception:
        pass

    Slider.objects.create(**data)

    return Response({
      'results': True
    })

  def update(self, request, *args, **kwargs):
    
    data = configurate(request, Slider)

    if data['image']:
      if isinstance(data['image'], InMemoryUploadedFile):
        data['image'] = FileUploader(data['image'])
      else:
        del data['image']

    Slider.objects.filter(pk=kwargs['pk']).update(**data)

    return Response({
      'results': True
    })

  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    return Response({
      'results': data.__dict__.get('data')
    })

class RubricListViewSet(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'
  ordering_fields = ['name', 'date']
  #search_fields = ['events__name', 'genres__pk', 'genres__name']
  ordering = ['position']

  queryset = Rubric.objects.all()
  serializer_class = RubricSerializer
  paginate_by = 50

  def get_serializer_context(self):
    return {'user': self.request.user}

  def get_queryset(self):
    filter = super().get_queryset()

    search = self.request.GET.get('search')
    genre = self.request.GET.get('genre')
    sort = self.request.GET.get('sort')

    if search:
      filter = filter.filter(
        Q(name__icontains=search) |
        Q(name__icontains=search.capitalize()) |
        Q(events__name__icontains=search) |
        Q(events__name__icontains=search.capitalize()) |
        Q(genres__name__icontains=search) |
        Q(genres__name__icontains=search.capitalize())
      )

    # if not self.request.user.is_authenticated or self.request.user.is_authenticated and self.request.user.role != 'admin':
    #   filter = filter.filter(events__dates__start_date__gt=datetime.datetime.now())

    #if genre:
    #  filter = filter.filter(genres=genre)

    #if sort:
    #  filter = filter.order_by(sort)

    return filter


class RubricViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminUser]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = Rubric.objects.all()
  serializer_class = RubricSerializer
  paginate_by = 50

  def get_queryset(self):
    filter = super().get_queryset()

    return filter

  def create(self, request, *args, **kwargs):
    #super().create(request, *args, **kwargs)
    d = request.data

    RubricSerializer.is_validated(attrs=d)

    data = {
      'name': d['name'],
      'position': int(d['position'])
    }

    if isinstance(d['image'], InMemoryUploadedFile):
      data['image'] = FileUploader(d['image'])
    
    try:
      genres = request.data.get('genres')
      events = request.data.get('events')

      special = Rubric.objects.create(**data)
      if genres:
        genres = json.loads(genres)
        if len(genres) > 0:
          genres = EventGenre.objects.filter(pk__in=genres)
          special.genres.set(genres)

      if events:
        events = json.loads(events)
        if len(events) > 0:
          events = Events.objects.filter(pk__in=genres)

          special.events.set(events)

    except Exception as e:
      RubricSerializer(data=data).is_valid(raise_exception=True)

    return Response({
      'results': True
    })

  def update(self, request, *args, **kwargs):
    
    d = request.data
    data = {
      'name': d['name'],
      'position': int(d['position'])
    }

    if d['image']:
      if isinstance(d['image'], InMemoryUploadedFile):
        data['image'] = FileUploader(d['image'])

    try:
      genres = request.data.get('genres')
      events = request.data.get('events')

      special = Rubric.objects.get(pk=kwargs['pk'])

      if genres:
        genres = json.loads(genres)
        gens = special.genres.all()
        if len(genres) == 0 and len(gens) > 0:
          special.genres.clear()
        elif len(genres) > 0:
          gens_f = special.genres.filter(pk__in=genres)
          if len(gens_f) != len(genres) or len(gens_f) != len(gens):
            
            special.genres.clear()
            genres = EventGenre.objects.filter(pk__in=genres)
            special.genres.set(genres)

      if events:
        events = json.loads(events)
        ents = special.events.all()
        if len(events) == 0 and len(ents) > 0:
          special.events.clear()
        elif len(events) > 0:
          ents_f = special.events.filter(pk__in=events)
          if len(ents_f) != len(events) or len(ents_f) != len(ents):
            special.events.clear()
            events = Events.objects.filter(pk__in=events)
            special.events.set(events)

      Rubric.objects.filter(pk=kwargs['pk']).update(**data)
    except Exception as e:
      RubricSerializer(data=data).is_valid(raise_exception=True)

    return Response({
      'results': True
    })

  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    return Response({
      'results': data.__dict__.get('data')
    })