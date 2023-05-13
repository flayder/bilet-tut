from operator import ge
import json, threading
from datetime import datetime, timedelta
from django.db.models import Q
from rest_framework import viewsets, generics, \
   authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from app.bao.models import *
from app.bao.api.serializers import *
from app.payment.models import *
from app.bao.models import *
from django_filters.rest_framework import DjangoFilterBackend
from .addition import *
from utils.sberbank import Sberbank
from utils.token import *
from utils.permission import *
from app.events.api.functions import *
from app.events.api.pagination import ResultsSetPaginationTen

#Метод для работы с CRUD проверяющих
class EventCheckerViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = EventCheckin.objects.all()
  serializer_class = EventCheckinSerializer
  pagination_class = ResultsSetPaginationTen
  
  def get_queryset(self):
    filter = super().get_queryset()
    
    if not self.request.user.is_authenticated or self.request.user.is_authenticated and self.request.user.role != 'admin':
      filter = filter.filter(checkout__user=self.request.user)

    return filter

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = EventCheckinSerializer(data=data)
    
    try:
      EventCheckin.objects.filter(pk=kwargs.get('pk')).update(**data)
    except Exception as e:
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })

  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    data = item.__dict__

    return Response({
      'results': data.get('data')
    })

  def create(self, request, *args, **kwargs):
    #request.data.setdefault('user', request.user)
    data = request.data
    # validate = EventPriceSerializer(data=data)

    # try:
    #   EventPrice.objects.create(**data)
    # except Exception:
    #   validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })

#Получение списка статусов заказа
class CheckoutReturnStatusListView(generics.ListAPIView):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [TokenAuthentication]

  queryset = CheckoutReturnStatus.objects.all()
  serializer_class = CheckOutReturnStatusSerializer
  paginate_by = 20


#Получение списка причин причин возврата
class CheckoutReturnReasonListView(generics.ListAPIView):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [TokenAuthentication]

  queryset = CheckoutReturnReason.objects.all()
  serializer_class = CheckOutReturnReasonSerializer
  paginate_by = 20
    

#Получение доступа к CRUD возвращений заказа
class CheckoutReturnView(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [authentication.TokenAuthentication]
  # ordering_fields = ["name"]
  # filterset_fields = '__all__'
  # search_fields = ["name"]

  queryset = CheckoutReturn.objects.all()
  serializer_class = CheckOutReturnSerializer
  paginate_by = 60

  def get_queryset(self):
    filter = super().get_queryset()
    orginiser = self.request.GET.get('orginiser')
    
    if self.request.user.role != 'admin':
      if not orginiser:
        filter = filter.filter(user=self.request.user)
      else:
        events_ids = Events.objects.filter(user=orginiser).values_list('pk')
        if len(events_ids) > 0:
          filter = filter.filter(checkout__products__in=events_ids)

    return filter

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = CheckOutReturnSerializer(data=data)
    
    try:
      CheckoutReturn.objects.filter(pk=kwargs.get('pk')).update(**data)
    except Exception as e:
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })

  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    data = item.__dict__

    return Response({
      'results': data.get('data')
    })

  def create(self, request, *args, **kwargs):
    #request.data.setdefault('user', {id: request.user.id})
    data = request.data
    validate = CheckOutReturnSerializer(data=data)

    try:
      if request.data.get('checkout'):
        data['checkout'] = Checkout.objects.get(pk=data['checkout'])

      if request.data.get('reason'):
        data['reason'] = CheckoutReturnReason.objects.get(pk=data['reason'])
         
      data['status'] = CheckoutReturnStatus.objects.get(pk=1)
      
      data['user'] = request.user

      CheckoutReturn.objects.create(**data)
    except Exception as e:
      print('checkout err', e)
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })


#Получение доступа к CRUD скидок на мероприятия
class DiscountViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [authentication.TokenAuthentication]
  #filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  #filterset_fields = '__all__'

  queryset = Discount.objects.all()
  serializer_class = DiscountSerializer
  paginate_by = 20
  
  def get_queryset(self):
    filter = super().get_queryset()

    filter = filter.filter(is_deleted=False)

    search = self.request.GET.get('search')
    genre = self.request.GET.get('event__genre')
    event = self.request.GET.get('event__pk')
    user = self.request.GET.get('user')

    if user:
      try:
        filter = filter.filter(user=int(user))
      except Exception:
        pass

    if search:
      filter = filter.filter(
        Q(name__contains=search) |
        Q(event__name__contains=search) |
        Q(event__genre__name__contains=search) |
        Q(user__login__contains=search) |
        Q(user__email__contains=search) |
        Q(user__phone__contains=search) |
        Q(user__username__contains=search) |
        Q(user__surname__contains=search) |
        Q(user__lastname__contains=search) |
        Q(user__legal_first_name__contains=search) |
        Q(user__legal_name__contains=search) |
        Q(user__legal_last_name__contains=search)
      )

    if genre:
      filter = filter.filter(event__genre=genre)

    filter = EventParamConfigurate(event, filter)

    if self.request.user.role != 'admin':
      filter = filter.filter(user=self.request.user)

    return filter

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = DiscountSerializer(data=data)
    
    try:
      Discount.objects.filter(pk=kwargs.get('pk')).update(**data)
    except Exception as e:
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })

  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    data = item.__dict__

    return Response({
      'results': data.get('data')
    })

  def create(self, request, *args, **kwargs):
    [event, data] = ConfigurateEventData(request, Discount)

    if event:
      data['event'] = event

    try:
      Discount.objects.create(**data)
    except Exception as e:
      print('error', e)
      DiscountSerializer(data=data).is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })

  def destroy(self, request, *args, **kwargs):

    try:
      Discount.objects.filter(pk=kwargs['pk']).update(is_deleted=True)
    except Exception:
      pass

    return Response({
      'results': True
    })

#Получение списка товаров из заказа
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def GetCheckoutBasketItemsView(request):
  orders = json.loads(request.GET.get('id'))
  data = []
  try:
    if len(orders) > 0:
      items = Basket.objects.filter(product__in=orders, ordered__gt=0).exclude(user=request.user).distinct('user')
      d = BasketSerializer(items, many=True)
      data = d.data
  except Exception:
    pass

  return Response({
    'results': data
  })


#Получение списка заказов
class CheckOutView(generics.ListAPIView):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [authentication.TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'
  
  queryset = Checkout.objects.all()
  serializer_class = CheckOutSerializer
  paginate_by = 20

  def get_queryset(self):
    filter = super().get_queryset()
    orginiser = self.request.GET.get('orginiser')
    if not orginiser:
      filter = filter.filter(user=self.request.user)
    else:
      #events_ids = []
      #events_ids = Events.objects.filter(user=orginiser).values_list('pk')

      filter = filter.filter(products__product__user=orginiser).distinct()
    return filter


#Повторение заказа
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def RepeatCheckOutView(request, pk):
  response = False

  try:
    checkout = Checkout.objects.get(pk=pk, user=request.user)
    items = Basket.objects.filter(user=request.user, ordered=0)
    for item in items:
      item.delete()

    for product in checkout.products.all():
      event = Events.objects.get(pk=product.product.id)
      Basket.objects.create(user=request.user, ordered=0, product=event)

    response = True
  except Exception as e:
    pass

  return Response({
    'results': response
  })

#Отправка билетов на почту клиента
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def RepeatBilets(request, pk):
  try:
    checkout = Checkout.objects.get(pk=pk)

    if checkout.status and checkout.status.code == 'paid':
      checkout.send_bilets()
      return Response({
        'results': True
      })
    
    return Response({
      'results': False
    })

  except Exception:
    return Response({
      'results': 'Заказа с таким id не найдено'
    }, 400)
  

#Выполнение повтора по заказу
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def RefundOrder(request, pk):
  try:
    checkout = Checkout.objects.get(pk=pk)

    if checkout.bank_field and checkout.status and checkout.status.code == 'paid':
      amount = 0
      
      if checkout.discount_price > 0:
        amount = checkout.discount_price

      else:
        amount = checkout.total_price

      if amount > 0:
        if checkout.payment and checkout.payment.code == 'card':
          client = Sberbank()
          client.refund(orderId=checkout.bank_field, amount=amount)

      return Response({
        'results': True
      })
    
    return Response({
      'results': False
    })

  except Exception:
    return Response({
      'results': 'Заказа с таким id не найдено'
    }, 400)

#Получение заказов для атворизированного пользователя
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def GetUserCheckoutsView(request, pk):
  baskets = []
  if int(pk) == 0:
    baskets = Basket.objects.filter(ordered__gt=0).distinct('user')
  else:
    baskets = Basket.objects.filter(product__user=pk, ordered__gt=0)
  #.distinct('user')

  event = request.GET.get('event')
  search = request.GET.get('search')
  
  
  if event:
    baskets = baskets.filter(product__pk=event)

  if search:
    baskets = baskets.filter(
      Q(product__name__contains=search) |
      Q(product__name__contains=search.capitalize()) |
      Q(product__user__email__contains=search.lower()) |
      Q(product__user__phone__contains=search.lower())
    )

  baskets = baskets.distinct('user')

  data = BasketSerializer(baskets, many=True)

  return Response({
    'results': data.data
  })

#Получение корзин для запрашиваемого пользователя
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def GetUserCheckoutListView(request, pk):

  baskets = Basket.objects.filter(product__user=pk, ordered__gt=0)
  #.distinct('user')

  event = request.GET.get('event')
  search = request.GET.get('search')
  status = request.GET.get('status')
  
  if event:
    baskets = baskets.filter(product__pk=event)

  if search:
    baskets = baskets.filter(
      Q(product__name__contains=search) |
      Q(product__name__contains=search.capitalize()) |
      Q(product__user__email__contains=search.lower()) |
      Q(product__user__phone__contains=search.lower())
    )

  if len(baskets) > 0:
    checkouts = Checkout.objects.filter(products__in=baskets.values_list('pk')).distinct('pk')
    
    if status:
      checkouts = checkouts.filter(status=status)

    d = CheckOutSerializer(checkouts, many=True)
    data = d.data
  else:
    data = []

  return Response({
    'results': data
  })


#Применить скидку
@api_view(['POST'])
@permission_classes([permissions.BasePermission])
@authentication_classes([])
def SetDiscountView(request):
  discount = request.data.get('discount')

  if not discount:
    return Response({
      'results': "Не переданы данные скидки"
    }, 400)

  elif isinstance(discount, str):
    try:
      discount = Discount.objects.get(
        Q(name=discount) |
        Q(name=discount.upper()) |
        Q(name=discount.lower())
      )
      #if discount.finish_date:
      #  date = discount.finish_date
      #  print('date', date > datetime.datetime.today())

      if not discount.is_active():
        return Response({
          'results': "Промокод недействителен"
        }, 400)

      if not discount.is_finish_date():
        return Response({
          'results': "Период испильзования истек"
        }, 400)

      if not discount.is_count():
        return Response({
          'results': "Количество попыток исчерпано"
        }, 400)


    except Exception as e:
      print('discount err', e)
      return Response({
        'results': "К сожалению данные этой скидки не были прменены"
      }, 400)

  serializer = DiscountSerializer(discount)

  return Response({
    'results': serializer.data
  })

#Получение списка товаров корзины
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
@authentication_classes([TokenAuthentication])
def BasketListView(request):
  items = []
  f_user = request.GET.get('f_user')

  data = {
    'product__status': 1, 
    'ordered': 0,
    'date__finish_date__gt': datetime.datetime.now()
  }

  if request.user.is_authenticated:
    data['user'] = request.user
    items = Basket.objects.filter(**data).order_by('id')
    
    if len(items) == 0 and f_user:
      data['f_user'] = f_user
      items = Basket.objects.filter(**data).order_by('id')
  
  elif not request.user.is_authenticated and f_user:
    data['f_user'] = f_user
    items = Basket.objects.filter(**data).order_by('id')

  serializer = BasketSerializer(items, many=True, context={'discount': request.GET.get('discount')})

  return Response({
    'results': serializer.data
  })

#Получение списка заказов по запрашиваемому мероприятию
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def PayStaticView(request, pk):
  
  data = []

  try:
    items = Basket.objects.filter(product=pk, ordered__gt=0).distinct('ordered').values_list('ordered')
    if len(items) > 0:
      checkouts = Checkout.objects.filter(pk__in=items)
      if len(checkouts) > 0:
        serializers = CheckOutSerializer(checkouts, many=True)
        data = serializers.data
  except Exception:
    pass
  
  return Response({
    'results': data
  })

#Удаление товра из корзины
@api_view(['DELETE'])
@permission_classes([permissions.AllowAny])
@authentication_classes([TokenAuthentication])
def RemoveItem(request, pk):
  result = False
  f_user = request.GET.get('f_user')
  items = []
  if request.user.is_authenticated:
    items = Basket.objects.filter(pk=pk, ordered=0, user=request.user)
  elif f_user:
    items = Basket.objects.filter(pk=pk, ordered=0, f_user=f_user)

  if len(items) > 0:
    for item in items:
      item.delete()

    result = True

  return Response({
    'results': result
  })

#Добавление заказа
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([authentication.TokenAuthentication])
def AddCheckOut(request):
  result = False
  
  payment = request.data.get('payment')
  discount = request.data.get('discount')

  if not payment:
    return Response({
      'results': 'Не выбран способ оплаты'
    }, 400)

  process = DiscountProcess(request=request)
  items = process.getBasketItems()
  #print('items', items)

  if len(items) > 0:
    try:
      pay = Payment.objects.get(pk=payment)
      status = CheckoutStatus.objects.get(pk=1)
      params = {
        'payment': pay,
        'status': status,
        'user': request.user
      }

      checkout = Checkout(**params)
      checkout.save()
      checkout.products.set(items)
      checkout.save()

      if discount:
        try:
          discount = Discount.objects.get(pk=discount)
          if discount.is_acceptable():
            checkout.discount = discount
            checkout.save()

        except Exception as e:
          print('check dis err', e)
          pass

      process.calculateCheckout(checkout)
      items.update(user=request.user, ordered=checkout.pk)
      checkout = Checkout.objects.get(pk=checkout.pk)
      
      if checkout.discount_value > 0:
        amount = checkout.discount_value
      else:
        amount = checkout.total_price

      if pay.code == 'free' and amount == 0:
        try:
          paid_status = CheckoutStatus.objects.get(code='paid')
          checkout.status = paid_status
          checkout.save()
          threading.Thread(target=send_bilets, args=(checkout,)).start()
        
        except Exception:
          return Response({
            'results': 'Статус заказа не выставлен, обратитесь к администратору'
          }, 400)

        result = True
      else:
        if pay.code == 'card':
          #перевод из копеек в рубли
          amount = amount * 100
          
          client = Sberbank()

          response = client.pay(orderNumber=checkout.pk, amount=amount)
          #response = {"orderId":"7ea75069-0070-7159-be67-87852908a320","formUrl":"https://secure-payment-gateway.ru/payment/merchants/sbersafe_sberid/payment_ru.html?mdOrder=7ea75069-0070-7159-be67-87852908a320"}
          order_id = response.get('orderId')
          if order_id:
            Checkout.objects.filter(pk=checkout.pk).update(bank_field=order_id)

            result = {
              'id': checkout.pk,
              'url': response.get('formUrl')
            }

          else:
            result = False


    except Exception as check:
      print('check out', check)
      pass

  else:
    return Response({
      'results': 'Продукты корзины отстутствуют'
    }, 400)

  return Response({
    'results': result
  })


#Добавление товара в корзину
@api_view(['POST'])
@permission_classes([permissions.BasePermission])
@authentication_classes([TokenAuthentication])
def AddBasket(request):
  product = request.data.get('product')
  date = request.data.get('date')
  price = request.data.get('price')
  place = request.data.get('place')
  category = request.data.get('category')
  quantity = request.data.get('quantity')
  f_user = request.data.get('f_user')
  user = request.user
  update = False

  # print('datetime date', dir(datetime.date))
  # print('datetime', dir(datetime))

  # return

  if not user.is_authenticated and not f_user:
    return Response({
      'results': 'Не предоставлены необходимые данные'
    }, 400)


  try:
    product = Events.objects.get(pk=product)

    if product.status.pk != 1:
      return Response({
        'results': f'{product.name} неактивно'
      }, 400)
  except Exception:
    return Response({
      'results': 'Неверные данные мероприятия'
    }, 400)

  try:
    date = EventDate.objects.get(pk=date, user=product.user)
  except Exception:
    return Response({
      'results': 'Неверные данные даты проведения мероприятия'
    }, 400)

  try:
    if int(quantity) > 0:
      quantity = int(quantity)
    else:
      quantity = 1
  except Exception:
    quantity = 1

  if price:

    try:
      place = EventAreaPlaces.objects.get(pk=place)
    except Exception:
      return Response({
        'results': 'Место небыло указано в данных'
      }, 400)

    try:
      price = EventPrice.objects.get(pk=price, user=product.user)

      # try:
      #   Basket.objects.get(price=price)
      # except Exception:
      #   pass
      
      try:
        Checkout.objects.get(products__product__price=price, products__product__place=place, payment__status=2)
        
        return Response({
          'results': f"Билет с ценой {price.price} уже куплен"
        }, 400)

      except Exception:
        pass


    except Exception:
      price = False

  if category:
    try:
      category = EventAreaCategory.objects.get(pk=category, user=product.user)
      
      try:
        allquantity = int(category.count)

        counts = Basket.objects.filter(category=category, ordered__gt=0)

        if len(counts) > 0:
          quant = 0
          for count in counts:
            try:
              quant += int(count.quantity)
            except Exception:
              pass

          if allquantity < quant:
            return Response({
              'results': f"Запрашиваемое количество билетов {quantity} с категорией цен {category} невозможно, осталось билетов {allquantity - quant}"
            }, 400)

      except Exception:
        pass
    
    except Exception:
      category = False


  if not price and not category:
    return Response({
      'results': 'Неверные данные о цене мероприятия'
    }, 400)
  
  payment = product.payment.all()

  try:
    upDate = {
      'product': product,
      'date': date,
      'ordered': 0
    }

    if category:
      upDate['category'] = category

    if price:
      upDate['price'] = price
      upDate['place'] = place

    try: 
      upDate['f_user'] = f_user
      update = Basket.objects.get(**upDate)
    except Exception:
      if user.is_authenticated:
        del upDate['f_user']
        upDate['user'] = user
      
        update = Basket.objects.get(**upDate)

  except Exception as e:
    pass

  try:
    if not update:
      data = {
        'product': product,
        'date': date
      }

      if price:
        data['price'] = price

        if len(payment) > 0 and payment[0].code == 'free':
          data['pricing'] = 0
        else:
          data['pricing'] = price.price

        data['quantity'] = 1
        data['place'] = place

      if category:
        data['category'] = category

        if len(payment) > 0 and payment[0].code == 'free':
          data['pricing'] = 0
        else:
          data['pricing'] = category.price

        data['quantity'] = quantity

      if user.is_authenticated:
        data['user'] = user
      else:
        data['f_user'] = f_user
      #print('data', data)

      Basket.objects.create(**data)
    else:
      if not price:
        available = update.is_available()
        if quantity <= available:
          Basket.objects.filter(pk=update.pk).update(quantity=quantity)
        else:
          Basket.objects.filter(pk=update.pk).update(quantity=available)

  except Exception as check:
    print('basket err', check)
    pass

  return Response({
    'results': True
  })


#admin
class AdminBasketViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminUser]
  authentication_classes = [authentication.TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = Basket.objects.all()
  serializer_class = BasketSerializer
  paginate_by = 20

  def get_queryset(self):
    return super().get_queryset().distinct() 


#Проверка билета по qr code
@api_view(['POST'])
@permission_classes([IsUserChecker])
@authentication_classes([TokenCheckersAuthentication])
def CheckBilet(request):
  qr = request.data.get('qr')

  checker = request.user

  if qr:
    try:
      basket = Basket.objects.get(qr_code=qr, ordered__gt=0, product__user__pk=checker.user.pk)
      return setCheckIn(basket, checker)
    except Exception:
      pass
  
  return Response({
    'results': False,
    'error': 'Билет с таким qr кодом не найден',
    'bilet': False
  })


#Получить данные по статистике
@api_view(['GET'])
@permission_classes([IsUserChecker])
@authentication_classes([TokenCheckersAuthentication])
def GetStatisticInfo(request):
  product = request.GET.get('product')
  #print('product', product)

  checkouts = 0
  checkin = []
  if product:
    try:
      checkouts = Checkout.objects.filter(products__product=product, status=2).distinct('id').count()
    except Exception as e:
      print('checkouts err', e)
      pass

    try:
      checks = EventCheckin.objects.filter(checker=request.user, product__product=product)
      serial = EventCheckinSerializer(checks, many=True)

      checkin = [status['status'] for status in serial.data]
    except Exception as e:
      print('check in err', e)
      pass


  return Response({
    'checkouts': checkouts,
    'checkin': checkin
  })



#Получение информации о заказах
class CheckOutCheckerView(viewsets.ModelViewSet):
  permission_classes = [IsUserChecker]
  authentication_classes = [TokenCheckersAuthentication]
  
  queryset = Basket.objects.all()
  serializer_class = BasketSerializer

  def get_queryset(self):
    filter = super().get_queryset()

    filter = filter.filter(ordered__gt=0, product__user=self.request.user.user)

    search = self.request.GET.get('search')
    event = self.request.GET.get('event')

    if event:
      print('event', event)
      try:
        baskets = EventCheckin.objects.filter(product__product__pk=int(event), product__ordered__gt=0, checker=self.request.user).distinct('product__pk').values_list("product__pk")
        
        if len(baskets) > 0:
          filter = filter.filter(pk__in=baskets)
        else:
          filter = filter.filter(pk=0)
      except Exception as e:
        print('errr list', e)
        pass

    if search:
      try:
        search = int(search)
        filter = filter.filter(
                  Q(pk__contains=search) |
                  Q(ordered__contains=search)
                ).distinct('pk')
      except Exception:
        filter = filter.filter(
                Q(product__name__contains=search.lower()) |
                Q(product__name__contains=search.capitalize()) |
                Q(user__username__contains=search.lower()) |
                Q(user__username__contains=search.capitalize()) |
                Q(user__surname__contains=search.lower()) |
                Q(user__surname__contains=search.capitalize()) |
                Q(user__lastname__contains=search.lower()) |
                Q(user__lastname__contains=search.capitalize()) |
                Q(user__organisation_name__contains=search.lower()) |
                Q(user__organisation_name__contains=search.capitalize()) |
                Q(user__legal_first_name__contains=search.lower()) |
                Q(user__legal_first_name__contains=search.capitalize()) |
                Q(user__legal_name__contains=search.lower()) |
                Q(user__legal_name__contains=search.capitalize()) |
                Q(user__legal_last_name__contains=search.lower()) |
                Q(user__legal_last_name__contains=search.capitalize()) |
                Q(user__login__contains=search.lower()) |
                Q(user__login__contains=search.capitalize()) |
                Q(user__email__contains=search.lower()) |
                Q(user__email__contains=search.capitalize()) |
                Q(user__phone__contains=search.lower()) |
                Q(user__phone__contains=search.capitalize())
              ).distinct('pk')

    return filter


  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    return Response({
      'results': data.__dict__.get('data')
    })


  def create(self, request, *args, **kwargs):
    return Response({
      'results': 'В доступе отказано'
    }, 400)

  def update(self, request, *args, **kwargs):
    activate = request.data.get('activate')

    if not activate:
      return Response({
        'results': 'В доступе отказано'
      }, 400)

    checker = request.user
    basket = False

    try:
      basket = Basket.objects.get(pk=activate, ordered__gt=0, product__user__pk=checker.user.pk)
    except Exception:
      pass
  
    return setCheckIn(basket, checker)


  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    data = data.__dict__.get('data')

    data = ConfOrderData(data)
      
    try:
      order = Checkout.objects.get(pk=data['order'])
      serialize = CheckOutSerializer(order)
      data['status'] = serialize.data['status']

    except Exception as e:
      print('order detail err', e)
      pass

    return Response({
      'results': data
    })


  def list(self, request, *args, **kwargs):
    items = super().list(request, *args, **kwargs)

    data = []
    orders = {}

    for item in items.data['results']:
      d = ConfOrderData(item)
      
      try:
        if not orders.get(item['ordered']):
          order = Checkout.objects.get(pk=item['ordered'])
          serialize = CheckOutSerializer(order)
          orders[item['ordered']] = serialize.data
          d['status'] = serialize.data['status']
        else:
          d['status'] = orders.get(item['ordered'])['status']

      except Exception as e:
        print('order err', e)
        pass

      data.append(d)


    return Response({
      'results': data
    })