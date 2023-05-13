from datetime import datetime, timedelta
from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from app.events.models import *
from app.images.api.serializers import ImageSerializer
from app.bao.models import *
from app.geo.api.serializers import *
from app.events.api.functions import ifValidateFile
from app.users.api.serializers import UserSerializer, UserCheckerSerializer

class TypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = EventType
    fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):
  class Meta:
    model = EventStatus
    fields = '__all__'

class EventAgeSerializer(serializers.ModelSerializer):
  class Meta:
    model = EventAge
    fields = '__all__'

class EventAreaPlacesSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = EventAreaPlaces
    fields = '__all__'

class EventAreaSchemsSerializer(serializers.ModelSerializer):
  #places = EventAreaPlacesSerializer(many=True)
  preview = ImageSerializer(many=True)
  
  class Meta:
    model = EventAreaSchems
    fields = '__all__'

class PointSerializer(GeoFeatureModelSerializer):
  class Meta:
    model = EventArea
    geo_field = "location"
    fields = ['location']

class EventAreaSerializer(serializers.ModelSerializer):
  city = CitySerializer()
  gallery = ImageSerializer(many=True)
  schems = EventAreaSchemsSerializer(many=True)
  
  class Meta:
    model = EventArea
    fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
  class Meta:
    model = EventGenre
    fields = '__all__'

  def is_validated(attrs):
    if not attrs['name']:
      raise serializers.ValidationError('Название жанра обязательное поле для заполнения')

class EventPriceSerializer(serializers.ModelSerializer):
  user = UserSerializer()
  place = EventAreaPlacesSerializer(many=True)
  basket = serializers.SerializerMethodField('set_basket')
  
  class Meta:
    model = EventPrice
    fields = '__all__'

  def set_basket(self, obj: EventPrice):
    date = self.context.get('date')
    event = self.context.get('event')

    if date and event:

      try:
        basket = Basket.objects.get(date=date, product=event, price=obj)
        if basket.ordered > 0:
          return True
        
        cr_at = basket.created_at
        
        date = datetime.datetime(year=cr_at.year, month=cr_at.month, day=cr_at.day, hour=cr_at.hour, minute=cr_at.minute)
        date = date + timedelta(minutes=10)
        
        now = datetime.datetime.now()
        now = datetime.datetime(year=now.year, month=now.month, day=now.day, hour=now.hour, minute=now.minute)
        
        #бронирование билета на 10 минут
        if date > now:
          return True

      except Exception as e:
        print('serial price', e)
        pass

    return False

class EventAreaCategorySerializer(serializers.ModelSerializer):
  user = UserSerializer()
  basket = serializers.SerializerMethodField('set_basket')
  #scheme = EventAreaPlacesSerializer(many=True)
  
  class Meta:
    model = EventAreaCategory
    fields = '__all__'

  def set_basket(self, obj: EventAreaCategory):
    date = self.context.get('date')
    event = self.context.get('event')

    if date and event:
      # print('date cat', date)
      # print('product cat', event)
      # print('price cat', obj)
      quant = 0
      basket_quantity = Basket.objects.filter(date=date, ordered__gt=0, product=event, category=obj).values('quantity')
      for quantity in basket_quantity:
        quant += quantity['quantity']

      return quant

    return 0


class EventMailTemplateSerializer(serializers.ModelSerializer):
  user = UserSerializer()
  image = ImageSerializer()
  
  class Meta:
    model = EventMailTemplate
    fields = '__all__'



class EventSerializer(serializers.ModelSerializer):

  afisha = ImageSerializer(many=False)
  preview = ImageSerializer(many=False)
  stage_image = ImageSerializer(many=True)
  city = CitySerializer()
  genre = GenreSerializer(many=True)
  status = StatusSerializer()
  type = TypeSerializer()
  user = UserSerializer()
  area = EventAreaSerializer()
  prices = EventPriceSerializer(many=True)
  categories = EventAreaCategorySerializer(many=True)
  favorite = serializers.SerializerMethodField('set_favorite')
  price = serializers.SerializerMethodField('set_price')
  start_date = serializers.SerializerMethodField('set_start_date')
  finish_date = serializers.SerializerMethodField('set_finish_date')

  def set_price(self, event):
    area = event.area
    if area.is_scheme:
      price = event.prices.filter(is_deleted=False).order_by('price')
      if len(price) > 0:
        return [price[0].price, price[len(price) - 1].price]

      else:
        category = event.categories.filter(is_deleted=False).order_by('price')
        if len(category) > 0:
          return [category[0].price, category[len(category) - 1].price]

    return [0, 0]

  def set_favorite(self, obj):
    try:
      EventFavorite.objects.get(event=obj.id, user=self.context.get('user').id)
      return True
    except Exception as e:
      #print('e', e)
      pass
    
    return False

  def set_start_date(self, obj):
    date = obj.dates.filter(is_deleted=False, start_date__gt=datetime.datetime.now()).order_by('start_date')[:1]
    if len(date) > 0:
      return date[0].start_date

    # else:
    #   date = obj.dates.filter(is_deleted=False).order_by('start_date')[:1]
    #   if len(date) > 0:
    #     return date[0].start_date
    return 0

  def set_finish_date(self, obj):
    date = obj.dates.filter(is_deleted=False).order_by('-start_date')[:1]
    if len(date) > 0:
      return date[0].start_date

    else:
      return 0


  def validate(self, attrs):
    errors = []

    #print('attrs', attrs)

    if not attrs.get('name'):
      errors.append('Название обязательное поле для заполнения!')

    if not attrs.get('area'):
      errors.append('Площадка обязательное поле для заполнения!')

    if not attrs.get('afisha') or attrs.get('afisha') and not ifValidateFile(attrs.get('afisha')):
      errors.append('Афиша обязательное поле для заполнения!')
    
    if not attrs.get('preview') or attrs.get('preview') and not ifValidateFile(attrs.get('preview')):
      errors.append('Анонс обязательное поле для заполнения!')

    if not attrs.get('status'):
      errors.append('Статус обязательное поле для заполнения!')
    
    if not attrs.get('genre'):
      errors.append('Жанр обязательное поле для заполнения!')

    if not attrs.get('payment'):
      errors.append('Способ оплаты обязательное поле для заполнения!')

    # if not attrs.get('start_date'):
    #   errors.append('Дата проведения обязательное поле для заполнения!')

    # if not attrs.get('finish_date'):
    #   errors.append('Дата закрытия продаж обязательное поле для заполнения!')

    if not attrs.get('city'):
      errors.append('Город обязательное поле для заполнения!')

    # if not attrs.get('stage_image'):
    #   errors.append('Города обязательное поле для заполнения!')

    if len(errors) > 0:
      raise serializers.ValidationError(errors)
  
  class Meta:
    model = Events
    fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
  user = UserSerializer()
  event = EventSerializer()

  class Meta:
    model = EventFavorite
    fields = '__all__'


class EventDateSerializer(serializers.ModelSerializer):
  event = EventSerializer(many=True)
  schemes = EventAreaSchemsSerializer(many=True)
  
  class Meta:
    model = EventDate
    fields = '__all__'


class EventPromotionSerializer(serializers.ModelSerializer):
  event = EventSerializer()
  user = UserSerializer()

  class Meta:
    model = EventPromotion
    fields = '__all__'