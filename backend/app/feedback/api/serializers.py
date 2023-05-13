from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from app.feedback.models import *
from app.feedback.api.serializers import *

class QuestionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Questions
    fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
  question = QuestionSerializer()
  
  class Meta:
    model = Feedback
    fields = '__all__'