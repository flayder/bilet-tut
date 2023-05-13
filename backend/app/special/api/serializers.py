from rest_framework import serializers
from django.conf import settings
from app.events.api.serializers import *
from app.special.models import *


class SpecialSerializer(serializers.ModelSerializer):
  genres = EventAgeSerializer(many=True)
  events = EventSerializer(many=True)

  class Meta:
    model = Special
    fields = '__all__'