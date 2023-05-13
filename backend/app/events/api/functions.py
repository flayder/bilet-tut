from app.events.models import *
import json
from app.bao.models import Discount
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from users.api.serializers import FileUploader
from utils.function import configurate as configuration

def ifValidateFile(data):
  if isinstance(data, InMemoryUploadedFile) or isinstance(data, TemporaryUploadedFile):
    return True
  
  return False

def configurate(request, data):
  try:
    area_id = request.data.get('area')
    if area_id:
      area = EventArea.objects.get(pk=area_id)

      data['area'] = area
  except Exception as err:
    pass

  try:
    type = request.data.get('type')
    if type:
      type = EventType.objects.get(pk=type)

      data['type'] = type
  except Exception as err:
    print('type err', err)
    pass

  try:
    age_id = request.data.get('age')
    if age_id:
      data['age'] = EventAge.objects.get(pk=age_id)
  except Exception:
    pass

  try:
    city_id = request.data.get('city')
    if city_id:
      data['city'] = City.objects.get(pk=city_id)
  except Exception:
    pass

  try:
    status_id = request.data.get('status')
    if status_id:
      data['status'] = EventStatus.objects.get(pk=status_id)
      print('status_id', status_id)
  except Exception as e:
    print('status err', e)
    pass
  
  try:
    payment_id = request.data.get('payment')
    if payment_id:
      data['payment'] = Payment.objects.get(pk=payment_id)
  except Exception:
    pass
  
  try:
    genre = json.loads(request.data.get('genre'))
    if genre and len(genre) > 0:
      genre = EventGenre.objects.filter(pk__in=genre)

      data['genre'] = genre
  except Exception as err:
    print('genre err', err)
    pass
  
  return data


def MultiFileUploader(request, name):
  item = 0
  files = []
  while request.data.get(f"{name}{item}"):
    image = request.data.get(f"{name}{item}")

    if ifValidateFile(image):
      file = FileUploader(image)
      files.append(file)

    item += 1

  return files


def EventUploadeManager(request, event: Events):
  preview = request.data.get('preview')
  afisha = request.data.get('afisha')
  stage_image = request.data.get('stage_image')

  try:
    if preview and ifValidateFile(preview):
      file = FileUploader(preview)
      event.preview = file
      event.save()
  except Exception:
    pass

  try:
    if afisha and ifValidateFile(afisha):
      file = FileUploader(afisha)
      event.afisha = file
      event.save()
  except Exception:
    pass

  try:
    json.loads(stage_image)

    files = MultiFileUploader(request, "stage_image")

    try:
      if len(files) > 0:
        event.stage_image.set(files)
        event.save() 
    except Exception:
      pass

  except Exception:
    if ifValidateFile(stage_image):
      file = FileUploader(stage_image)
      event.stage_image.add(file)
      event.save()


def GrabAllData(request, event: Events):
  user = request.user

  if user.role == 'admin':
    user = event.user

  try:
    dates = EventDate.objects.filter(user=user, is_deleted=False, event=None)
  
    if len(dates) > 0:
      for item in dates:
        event.dates.add(item)
        item.event.add(event)
        item.save()
      
      event.save()

  except Exception as e:
    print('dates err', e)
    pass


  try:
    discount = Discount.objects.get(user=user, event=None)
    print('discount', discount)
    discount.event = event
    discount.save()

  except Exception as e:
    print('discounts err', e)
    pass

  try:
    prices = EventPrice.objects.filter(user=user, event=None)
  
    if len(prices) > 0:
      for item in prices:
        event.prices.add(item)
        item.event.add(event)
        item.save()

      event.save()

  except Exception as e:
    print('prices err', e)
    pass

  try:
    categories = EventAreaCategory.objects.filter(user=user, event=None)
  
    if len(categories) > 0:

      for item in categories:
        event.categories.add(item)
        item.event.add(event)
        item.save()

      event.save()

      #categories.update(event=event)

  except Exception as e:
    print('cat err', e)
    pass

  try:

    mailtemplate = EventMailTemplate.objects.get(user=user, event=None)
    mailtemplate.event = event
    mailtemplate.save()

  except Exception as e:
    print('mailtemplate err', e)
    pass


def EventParamConfigurate(event, filter):
  if event:
    try:
      if int(event) > 0:
        filter = filter.filter(event=event)

      else:
        filter = filter.filter(event=None)
    except Exception:
      filter = filter.filter(event=None)
      
  return filter


def TryToGetEvent(event, user):

  try:
    event = Events.objects.get(pk=event, user=user)
  except Exception:
    event = False

  return event

def ConfigurateEventData(request, model):
  event = request.data.get('event')
  user = request.user
  data = configuration(request, model)

  data['user'] = user

  event = TryToGetEvent(event, user)

  if event:
    try:
      del data['event']
    except Exception:
      pass

  return [event, data]