from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from app.reports.models import *
from app.images.api.serializers import ImageSerializer
from app.geo.api.serializers import *
from app.users.api.serializers import UserSerializer

class ReportTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = ReportType
    fields = '__all__'


class ReportPeriodSerializer(serializers.ModelSerializer):
  class Meta:
    model = ReportPeriod
    fields = '__all__'

class ReportsSerializer(serializers.ModelSerializer):
  type = ReportPeriodSerializer()
  period = ReportPeriodSerializer()
  user = UserSerializer()
  
  class Meta:
    model = Reports
    fields = '__all__'