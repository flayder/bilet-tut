from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from app.bao.models import *
from app.events.api.serializers import *
from app.geo.api.serializers import *
from app.users.api.serializers import UserSerializer

class BasketSerializer(serializers.ModelSerializer):
  product = EventSerializer(many=False)
  user = UserSerializer(many=False)
  price = EventPriceSerializer(many=False)
  place = EventAreaPlacesSerializer(many=False)
  date = EventDateSerializer(many=False)
  category = EventAreaCategorySerializer(many=False)
  available = serializers.SerializerMethodField('set_available')
  pricing = serializers.SerializerMethodField('set_pricing')
  discount_price = serializers.SerializerMethodField('set_discount_price')

  class Meta:
    model = Basket
    fields = '__all__'

  def set_pricing(self, obj: Basket):
    if obj.pricing > 0:
      return obj.pricing
    elif obj.pricing == 0 and obj.product.payment.all().count() > 0 and obj.product.payment.all()[0].code == 'free':
      return obj.pricing
    else:
      return obj.get_price()

  def set_discount_price(self, obj: Basket):
    if obj.discount_price > 0:
      return obj.discount_price

    if self.context.get('discount'):
      try:
        discount = Discount.objects.get(name=self.context.get('discount'))
        return obj.get_discount_price(discount)
      except Exception as e:
        print('ser dis err', e)
        pass
      
    return 0

  def set_available(self, obj: Basket):
    return obj.is_available()


class CheckOutStatusSerializer(serializers.ModelSerializer):
  class Meta:
    model = CheckoutStatus
    fields = '__all__'


class DiscountSerializer(serializers.ModelSerializer):
  user = UserSerializer()
  event = EventSerializer()
  
  class Meta:
    model = Discount
    fields = '__all__'

class CheckOutSerializer(serializers.ModelSerializer):
  discount = DiscountSerializer()
  products = BasketSerializer(many=True)
  status = CheckOutStatusSerializer()
  user = UserSerializer()
  price = serializers.SerializerMethodField('set_price')

  class Meta:
    model = Checkout
    fields = '__all__'

  def set_price(self, checkout):
    return checkout.get_total_price()

class CheckOutReturnStatusSerializer(serializers.ModelSerializer):
  class Meta:
    model = CheckoutReturnStatus
    fields = '__all__'


class CheckOutReturnReasonSerializer(serializers.ModelSerializer):
  class Meta:
    model = CheckoutReturnReason
    fields = '__all__'


class CheckOutReturnSerializer(serializers.ModelSerializer):
  user = UserSerializer()
  checkout = CheckOutSerializer()
  status = CheckOutReturnStatusSerializer()
  reason = CheckOutReturnReasonSerializer()
  
  class Meta:
    model = CheckoutReturn
    fields = '__all__'

class EventCheckinStatusSerializer(serializers.ModelSerializer):
  class Meta:
    model = EventCheckinStatus
    fields = '__all__'

class EventCheckinSerializer(serializers.ModelSerializer):
  checker = UserCheckerSerializer()
  checkout = CheckOutSerializer()
  product = BasketSerializer()
  status = EventCheckinStatusSerializer()
  
  class Meta:
    model = EventCheckin
    fields = '__all__'