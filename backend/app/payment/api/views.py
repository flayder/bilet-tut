import threading
from django.http import JsonResponse
from rest_framework import viewsets, authentication, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.views import APIView
from app.payment.models import *
from app.payment.api.serializers import *
from utils.sberbank import *
from app.logging.models import Logging
from app.bao.models import *
from utils.cron import cron_init
from app.bao.api.addition import send_bilets
from utils.pushkin import Pushkin


class PaymentViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.AllowAny]

  queryset = Payment.objects.all()
  serializer_class = PaymentSerializer
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
  ordering_fields = ["id"]
  filterset_fields = '__all__'
  paginate_by = 20


#
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def SberPay(request):
  #user = User.objects.get(pk=2)
  #mail(recepients=[user], subject="Тестовой заголовок", message="Тело сообщения")
  
  #checkout = Checkout.objects.get(pk=126)
  #checkout.send_bilets()

  print('fffffffff')

  pushkin = Pushkin()
  pushkin.pay()

  return Response({
    'results': True
  })


@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def SberCallBack(request):
  user = User.objects.get(pk=1)
  Logging.objects.create(action=f"Лог сбера комбэк POST: {request.data}, GET: {request.GET}", user=user)
  
  mdOrder = request.GET.get('mdOrder')
  orderNumber = request.GET.get('orderNumber')
  operation = request.GET.get('operation')
  status = request.GET.get('status')

  if mdOrder and orderNumber and operation:
    try:
      if status == 1:
        
        checkout = Checkout.objects.get(pk=orderNumber, bank_field=mdOrder)

        if operation == 'refunded':
          try:
            status = CheckoutStatus.objects.get(code='refund')
            Checkout.objects.filter(pk=checkout.pk).update(status=status)
          except Exception as e:
            print('sber callback refund err', e)
            pass

        if operation == 'deposited':
          try:
            status = CheckoutStatus.objects.get(code='paid')
            Checkout.objects.filter(pk=checkout.pk).update(status=status)
          except Exception as e:
            print('sber callback paid err', e)
            pass

          checkout.send_bilets()

        if operation == 'reversed':
          try:
            status = CheckoutStatus.objects.get(code='reversed')
            Checkout.objects.filter(pk=checkout.pk).update(status=status)
          except Exception as e:
            print('sber callback reversed err', e)
            pass

    except Exception as e:
      print('sber callback checkout err', e)
      pass

  return Response('ok')

