
import math
from app.bao.models import *
from app.bao.api.serializers import *
from rest_framework.response import Response

class DiscountProcess:
    request = None
    order_id = None
    discount = None

    def __init__(self, request, order_id = None, discount = None):
        self.request = request
        self.order_id = order_id
        self.discount = discount

    def getBasketItems(self):
        f_user = self.request.GET.get('f_user')
        items = []

        if self.order_id == None:
            items = Basket.objects.filter(ordered=0, user=self.request.user)

            if len(items) == 0 and f_user:
              items = Basket.objects.filter(ordered=0, f_user=f_user)
        else:
            try:
                checkout = Checkout.objects.get(pk=self.order_id)
                items = checkout.products
            except Exception as get:
                print('getting items from checkout', get)

        return items

    def setBasketData(self, items: list[Basket]):
      for item in items:
        item.pricing = item.get_price()
        item.save()

    
    def setBasketDiscountData(self, items: list[Basket], discount: Discount):
      for item in items:
        item.discount_price = item.get_discount_price(discount)
        item.save()


    def getTax(self, items: list[Basket]):
      tax = {}

      for item in items:
        t = item.product.tax

        if t > 0:
          if not tax.get(item.product.id):
            tax[item.product.id] = t

      taxes = 0
      for t in tax:

        if tax[t] > 0:
          taxes += tax[t]


      if taxes > 0:
        price = self.getBasketTotalPrice(items)

        if price > 0:
          return math.ceil(price * taxes / 100)

      return taxes


    def getBasketTotalPrice(self, items: list[Basket]):
      price = 0

      for item in items:
        price += item.get_price() * item.quantity

      return price

    
    def getBasketTotalDiscountPrice(self, items: list[Basket], discount: Discount):
      price = 0

      for item in items:
        pr = item.get_price()
        dis = item.get_discount_price(discount)
        
        if dis > 0:
          pricing = dis
          
          if discount.point == 'percent':
            pricing = dis * item.quantity
          
          if pricing > 0:
            price += pricing
        else:
          price += pr

      return price


    def calculateCheckout(self, checkout: Checkout):
      try:

        products = checkout.products.all()

        if len(products) > 0:

          data = {
            'total_price': self.getBasketTotalPrice(products),
            'tax': self.getTax(products)
          }

          self.setBasketData(products)
          
          if checkout.discount:
            data['discount_type'] = checkout.discount.point
            data['discount_value'] = checkout.discount.value
            data['discount_price'] = self.getBasketTotalDiscountPrice(products, checkout.discount)
            
            self.setBasketDiscountData(products, checkout.discount)
        
          Checkout.objects.filter(pk=checkout.pk).update(**data)

      except Exception as e:
        print('calc check', e)
        pass


def send_bilets(checkout: Checkout):
  checkout.send_bilets()

def ConfOrderData(item):
  d = {}
  
  d['price'] = item['price']
  d['category'] = item['category']
  d['user'] = item['product']['user']
  d['place'] = item['place']
  d['order'] = item['ordered']
  d['pricing'] = item['pricing']
  d['id'] = item['id']
  d['product'] = item['product']

  return d


def setCheckIn(basket, checker):
  status = 4
  checkout = False
  checkin = False

  if isinstance(basket, Basket):
    try:
      checkout = Checkout.objects.get(pk=basket.ordered, status=2)
      checkins = EventCheckin.objects.filter(product=basket, status=1)

      if len(checkins) == 0:
        status = 1
      else:
        status = 3
    
    except Exception as e:
      print('check err', e)
      pass

  try:
    status = EventCheckinStatus.objects.get(pk=status)
  except Exception:
    pass

  if isinstance(basket, Basket):
    try:
      checkout = Checkout.objects.get(pk=basket.ordered)
    except Exception:
      pass

  if isinstance(status, EventCheckinStatus):
    data = {}

    if isinstance(checkout, Checkout):
      data['checkout'] = checkout

    if isinstance(basket, Basket):
      data['product'] = basket
    
    data['status'] = status
    data['checker'] = checker

    response = {}

    try:
      checkin = EventCheckin.objects.create(**data)
    except Exception as e:
      print('check create err', e)
      pass


    if isinstance(checkin, EventCheckin):
      d = EventCheckinSerializer(checkin)
      checkin = d.data
      response['checkin'] = checkin

      if checkin['product']:
        response['bilet'] = checkin['product']
        response['product'] = checkin['product']['product']
        response['place'] = checkin['product']['place']
        response['category'] = checkin['product']['category']
        response['user'] = checkin['product']['user']

      if status.pk == 1:
        response['results'] = True
        return Response(response)

      elif status.pk == 3:
        response['results'] = False
        response['error'] = 'Этот билет уже был проверен'

        return Response(response)

      else:
        response['results'] = False
        response['error'] = 'Билет с таким qr кодом не найден'
        return Response(response)

  return Response({
    'results': False,
    'error': 'Билет с таким qr кодом не найден',
    'bilet': False
  })