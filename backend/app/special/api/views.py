import json
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from utils.token import TokenAuthentication
from app.special.api.serializers import *
from app.special.models import *
from utils.permission import IsAdminUser

class SpecialViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminUser]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = Special.objects.all()
  serializer_class = SpecialSerializer
  paginate_by = 50

  def get_queryset(self):
    filter = super().get_queryset()

    # role = self.request.GET.get('user__role')

    # if role:
    #   filter = filter.filter(user__role=role)

    return filter

  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    return Response({
      'results': data.__dict__.get('data')
    })

  def create(self, request, *args, **kwargs):
    #return super().create(request, *args, **kwargs)
    d = request.data
    data = {
      'name': d['name'],
      'description': d['description']
    }
    try:
      genres = request.data.get('genres')
      events = request.data.get('events')

      special = Special.objects.create(**data)
      if genres:
        genres = json.loads(genres)
        if len(genres) > 0:
          genres = EventGenre.objects.filter(pk__in=genres)
          special.genres.set(genres)

      if events:
        events = json.loads(events)
        if len(events) > 0:
          events = Events.objects.filter(pk__in=events)

          special.events.set(events)

    except Exception as e:
      SpecialSerializer(data=data).is_valid(raise_exception=True)

    return Response({
     'results': True
    })

  def update(self, request, *args, **kwargs):
    # super().update(request, *args, **kwargs)\

    d = request.data
    data = {
      'name': d['name'],
      'description': d['description']
    }
    try:
      genres = request.data.get('genres')
      events = request.data.get('events')

      special = Special.objects.get(pk=kwargs['pk'])

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

      Special.objects.filter(pk=kwargs['pk']).update(**data)
    except Exception as e:
      #print('update', e)
      SpecialSerializer(data=data).is_valid(raise_exception=True)
    

    return Response({
     'results': True
    })