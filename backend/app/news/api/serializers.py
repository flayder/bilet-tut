from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers
from django.conf import settings
from app.users.api.serializers import *
from app.images.api.serializers import *
from app.news.models import *


class NewsSerializer(serializers.ModelSerializer):
  user = UserSerializer()
  image = ImageSerializer()

  class Meta:
    model = News
    fields = '__all__'

  def is_validated(attrs):
    if not attrs['image'] or not isinstance(attrs['image'], InMemoryUploadedFile):
      raise serializers.ValidationError('Некорректные данные фото')
    
    if not attrs['title']:
      raise serializers.ValidationError('Заголовок обязательное поле для заполнения')
    
    if not attrs['subtitle']:
      raise serializers.ValidationError('Подзаголовок обязательное поле для заполнения')