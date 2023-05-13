from django.shortcuts import render
from app.bao.models import Checkout, Basket
from app.events.models import Events, EventMailTemplate
from app.events.api.serializers import EventMailTemplateSerializer
from app.users.models import User
from utils.qr import qr_fun
from django.conf import settings

def bilet_pdf(request):
  
  order_id = request.GET.get('order_id')
  basket_id = request.GET.get('basket_id')
  event = False
  user = False
  date = False
  qr = False
  template = False
  template_photo = False

  try:
    order = Checkout.objects.get(pk=order_id)
  except Exception as e:
    print('order err', e)
    order = False
  
  try:
    basket = Basket.objects.get(pk=basket_id)
    user = User.objects.get(pk=basket.user.pk)
    date = basket.date.start_date.strftime('%d.%m.%Y %H:%M')
    
    if basket.product:
      event = Events.objects.get(pk=basket.product.pk)

      try:
        template = EventMailTemplate.objects.get(event=event.pk)
        serialiser = EventMailTemplateSerializer(template)
        if serialiser.data['image']:
          template_photo = serialiser.data['image']['image']['url']
      except Exception as e:
        print('template err', e)
        pass

  except Exception as e:
    print('basket err', e)
    basket = False

  if order and basket and event and user:
    qr = qr_fun(basket.qr_code, f"{basket.pk}_{order.pk}_{event.pk}_{user.pk}")

  #print('qr', qr)

  return render(request, 'views/pdf.html', {
    'basket': basket,
    'event': event,
    'order': order,
    'user': user,
    'date': date,
    'qr': qr,
    'template': template,
    'template_photo': template_photo
  })
