from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from app.page.models import *
from app.page.api.serializers import *

class ElementPageSerializer(serializers.ModelSerializer):
  class Meta:
    model = ElementPage
    fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
  elements = ElementPageSerializer(many=True)
  
  class Meta:
    model = Page
    fields = '__all__'