from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
import json
from app.events.models import *
from app.images.api.serializers import FileOrImageSerializer
from app.geo.api.serializers import *
from app.events.api.serializers import *
from app.users.api.serializers import UserSerializer
from app.mailing.models import *

class MailingSerializer(serializers.ModelSerializer):
  user_list = UserSerializer(many=True)
  event = EventSerializer(many=True)
  files = FileOrImageSerializer(many=True)
  
  def validate(self, data):
    user_list = []

    try:
      user_list = json.loads(data.get('user_list'))
    except Exception:
      pass

    if not data.get('events'):
      raise serializers.ValidationError('Поле мероприятия обязательное для заполнения', 400)
    elif not isinstance(json.loads(data.get('events')), list):
      raise serializers.ValidationError('Поле мероприятия неправильного формата', 400)
    
    if not data.get('toeveryone'):
      if len(user_list) == 0:
        raise serializers.ValidationError('Поле пользователи неправильного формата', 400)
    
    if not data.get('text'):
      raise serializers.ValidationError('Поле текста сообщения обязательное для заполнения', 400)
    
    if not data.get('type'):
      raise serializers.ValidationError('Поле тип сообщения обязательное для заполнения', 400)
    
  class Meta:
    model = Mailing
    fields = '__all__'