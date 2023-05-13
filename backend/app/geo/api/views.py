from django.http import JsonResponse
from rest_framework import viewsets, generics, authentication, permissions
from rest_framework.decorators import action as detail_route
from rest_framework.response import Response
from rest_framework.views import APIView
from app.geo.models import *
from app.geo.api.serializers import *
from django.db.models import Q

class CountryViewSet(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]

  queryset = Country.objects.all()
  serializer_class = CountrySerializer
  paginate_by = 20

  def get_queryset(self):
    filter = super().get_queryset()

    search = self.request.GET.get('search')

    if search:
      filter = filter.filter(Q(name__icontains=search) | Q(name__icontains=search.capitalize())).order_by('name')

    return filter


class CityViewSet(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]

  queryset = City.objects.all()
  serializer_class = CitySerializer
  paginate_by = 20

  def get_queryset(self):
    filter = super().get_queryset()

    search = self.request.GET.get('search')

    if search:
      filter = filter.filter(Q(name__icontains=search) | Q(name__icontains=search.capitalize())).order_by('name')


    return filter
