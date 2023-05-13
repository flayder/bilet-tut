from rest_framework import status
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
import json
from django_filters.rest_framework import DjangoFilterBackend
from app.mailing.models import *
from app.mailing.api.serializers import *
from app.bao.models import Basket
from app.geo.models import *
from django.db.models import Q
from django.db import models as django_models
from django_filters import rest_framework as filtering
from rest_framework import viewsets

class MailingView(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [authentication.TokenAuthentication]
  # ordering_fields = ["name"]
  # filterset_fields = '__all__'
  # search_fields = ["name"]

  queryset = Mailing.objects.all()
  serializer_class = MailingSerializer
  paginate_by = 60

  def get_queryset(self):
    filter = super().get_queryset()
    filter = filter.filter(user=self.request.user)

    return filter

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = MailingSerializer(data=data)
    
    try:
      Mailing.objects.filter(pk=kwargs.get('pk')).update(**data)
    except Exception as e:
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })

  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    data = item.__dict__

    return Response({
      'results': data.get('data')
    })

  def create(self, request, *args, **kwargs):
    #request.data.setdefault('user', request.user)
    formdata = {}
    data = request.data
    validate = MailingSerializer(data=data)
    validate.validate(data)
    formdata['date'] = f"{data['date']} {data['time']}"
    formdata['type'] = data['type']
    formdata['toeveryone'] = True if data['toeveryone'] == 'true' else False
    formdata['text'] = data['text']
    formdata['user'] = request.user
    users = []

    events = Events.objects.filter(pk__in=json.loads(data['events']))
    if not formdata['toeveryone']:
      users = User.objects.filter(pk__in=json.loads(data['user_list']))
    
    try:
      mailing = Mailing.objects.create(**formdata)
     
      for event in events:
        mailing.event.add(event)

      for user in users:
        mailing.user_list.add(user)

      i = 0
      while request.data.get(f'files{i}'):
        file = FileOrImageUploader(request.data.get(f'files{i}'))
        if file:
          mailing.files.add(file)
        i += 1

    except Exception as e:
      print('err', e)
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })
  