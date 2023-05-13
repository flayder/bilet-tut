import json
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers
from django.conf import settings
from app.images.api.serializers import *
from app.events.api.serializers import *
from app.design.models import *


class SliderSerializer(serializers.ModelSerializer):
  image = ImageSerializer()
  event = EventSerializer()
  type = TypeSerializer()

  class Meta:
    model = Slider
    fields = '__all__'

  def is_validated(attrs):
    if not attrs['image'] or not isinstance(attrs['image'], InMemoryUploadedFile):
      raise serializers.ValidationError('Некорректные данные фото')
    
    if not attrs['title']:
      raise serializers.ValidationError('Заголовок обязательное поле для заполнения')
    
    if not attrs['subtitle']:
      raise serializers.ValidationError('Подзаголовок обязательное поле для заполнения')

    if not attrs['name']:
      raise serializers.ValidationError('Название слайда обязательное поле для заполнения')

    if not attrs['link']:
      raise serializers.ValidationError('Ссылка слайда обязательное поле для заполнения')

    if not attrs['date']:
      raise serializers.ValidationError('Дата слайда обязательное поле для заполнения')


class RubricSerializer(serializers.ModelSerializer):
  image = ImageSerializer()
  genres = GenreSerializer(many=True)
  events = EventSerializer(many=True)

  class Meta:
    model = Rubric
    fields = '__all__'

  def is_validated(attrs):
    if not attrs['image'] or not isinstance(attrs['image'], InMemoryUploadedFile):
      raise serializers.ValidationError('Некорректные данные фото')
    
    if not attrs['name']:
      raise serializers.ValidationError('Название рубрики обязательное поле для заполнения')
    
    events = json.loads(attrs['events'])

    if len(events) == 0:
      raise serializers.ValidationError('Мероприятия обязательное поле для заполнения')
    
    genres = json.loads(attrs['genres'])

    if len(genres) == 0:
      raise serializers.ValidationError('Жанр обязательное поле для заполнения')