from rest_framework import serializers

from app.geo.models import *

class CountrySerializer(serializers.ModelSerializer):
  class Meta:
    model = Country
    fields = ('id', 'name')

class RegionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Region
    fields = ('id', 'name')

class CitySerializer(serializers.ModelSerializer):
  class Meta:
    model = City
    fields = ('id', 'name')

