from rest_framework import serializers
from django.conf import settings
from app.users.api.serializers import *
from app.logging.models import *


class LoggingSerializer(serializers.ModelSerializer):
  user = UserSerializer()

  class Meta:
    model = Logging
    fields = '__all__'