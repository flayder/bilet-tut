import json
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from app.events.models import *
from app.bao.models import *
from app.events.api.serializers import *
from app.geo.models import *
from app.logging.models import Logging
from django.db.models import Q
from utils.token import TokenAuthentication
from rest_framework import viewsets
from users.api.serializers import FileUploader
from utils.permission import *
from utils.token import *
from utils.function import configurate as configuration
from .functions import *
from .pagination import *
from datetime import timedelta
from django.db.models import Max


#Метод для получения списка данных мест мероприятия
class EventPlaceListView(viewsets.ModelViewSet):
  permission_classes = [permissions.BasePermission]
  authentication_classes = []
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  #ordering_fields = ["start_date", "finish_date", "id"]
  filterset_fields = "__all__"
  #filter_class = EventFilter
  #search_fields = ["name"]
  #ordering = ["start_date"]

  queryset = EventAreaPlaces.objects.all()
  serializer_class = EventAreaPlacesSerializer
  pagination_class = LargeResultsSetPagination

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
    return Response({
      'results': 'В доступе отказано'
    }, 400)

  def destroy(self, request, *args, **kwargs):
    return Response({
      'results': 'В доступе отказано'
    }, 400)


#Метод для получения списка данных для даты мероприятия
class EventDateListView(generics.ListAPIView):
  permission_classes = [permissions.BasePermission]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["start_date", "finish_date", "id"]
  filterset_fields = ["start_date", "schemes", "finish_date", "id", "event"]
  #filter_class = EventFilter
  #search_fields = ["name"]
  ordering = ["start_date"]

  queryset = EventDate.objects.all()
  serializer_class = EventDateSerializer
  pagination_class = LargeResultsSetPagination

  
  def get_queryset(self):
    filter = super().get_queryset()
    filter = filter.filter(is_deleted=False)

    user = self.request.GET.get('user')

    if user and user != 'false':
      filter = filter.filter(user=self.request.user)

    event = self.request.GET.get('event__pk')

    filter = EventParamConfigurate(event, filter)

    #print('filter q', filter.query)

    return filter


#Метод для работы с CRUD для ролей организатор и админ
class EventDateView(viewsets.ModelViewSet):
  permission_classes = [IsNoViewer]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["start_date", "finish_date", "id"]
  filterset_fields = ["start_date", "finish_date", "id"]
  ordering = ["-start_date"]

  queryset = EventDate.objects.all()
  serializer_class = EventDateSerializer
  paginate_by = 200

  def get_queryset(self):
    filter = super().get_queryset()

    filter = filter.filter(is_deleted=False)

    return filter

  def create(self, request, *args, **kwargs):
    user = request.user
    event = request.data.get('event')
    data = request.data

    data['user'] = user

    if event:
      del data['event']
      try:
        event = Events.objects.get(pk=event, user=user)
      except Exception:
        event = False

    try:
      date = EventDate.objects.create(**data)

      print('date', date)
      print('event', event)

      if event:
        date.event.add(event)
        date.save()

    except Exception as e:
      print('er', e)
      EventDateSerializer(data=data).is_valid(raise_exception=True)

    return Response({
      'results': True
    })


  def update(self, request, *args, **kwargs):
    data = request.data
    try:
      EventDate.objects.filter(pk=kwargs['pk']).update(**data)
    except Exception as e:
      print('update', e)
      EventDateSerializer(data=data).is_valid(raise_exception=True)

    return Response({
      'results': True
    })

  
  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    
    return Response({
      'results': item.data
    })

  def destroy(self, request, *args, **kwargs):

    try:
      EventDate.objects.filter(pk=kwargs['pk']).update(is_deleted=True)
    except Exception:
      pass
    
    return Response({
      'results': True
    })


#Метод для получения списка данных по промоакциям
class EventPromotionListView(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]
  authentication_classes = []
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["start_date", "finish_date", "id", "event"]
  filterset_fields = ["start_date", "finish_date", "id", "event"]


  queryset = EventPromotion.objects.all()
  serializer_class = EventPromotionSerializer
  pagination_class = LargeResultsSetPagination

  
  def get_queryset(self):
    filter = super().get_queryset()

    # user = self.request.GET.get('user')

    # if user and user != 'false':
    #   filter = filter.filter(user=self.request.user)

    # event = self.request.GET.get('event__pk')

    # filter = EventParamConfigurate(event, filter)

    # #print('filter q', filter.query)

    return filter


#Метод для работы с CRUD для ролей организатор и админ
class EventPromotionView(viewsets.ModelViewSet):
  permission_classes = [IsNoViewer]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["start_date", "finish_date", "id", "event"]
  filterset_fields = ["start_date", "finish_date", "id", "event"]

  queryset = EventPromotion.objects.all()
  serializer_class = EventPromotionSerializer
  paginate_by = 200

  def get_queryset(self):
    filter = super().get_queryset()

    return filter

  def create(self, request, *args, **kwargs):
    user = request.user
    event = request.data.get('event')
    data = request.data

    data['user'] = user

    if event:
      try:
        data['event'] = Events.objects.get(pk=event, user=user)
      except Exception:
        data['event'] = False

    print('data', data)

    try:
      EventPromotion.objects.create(**data)

    except Exception as e:
      print('er', e)
      EventPromotionSerializer(data=data).is_valid(raise_exception=True)

    return Response({
      'results': True
    })


  def update(self, request, *args, **kwargs):
    data = request.data
    try:
      EventPromotion.objects.filter(pk=kwargs['pk']).update(**data)
    except Exception as e:
      print('update', e)
      EventPromotionSerializer(data=data).is_valid(raise_exception=True)

    return Response({
      'results': True
    })

  
  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    
    return Response({
      'results': item.data
    })

  def destroy(self, request, *args, **kwargs):

    try:
      EventPromotion.objects.filter(pk=kwargs['pk']).update(is_deleted=True)
    except Exception:
      pass
    
    return Response({
      'results': True
    })


#Метод для получения данных List and Retrieve мероприятия для всех ролей
class EventListView(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  #ordering_fields = ["id", "name"]
  filterset_fields = ['area', 'user', 'type']

  queryset = Events.objects.all()
  serializer_class = EventSerializer
  pagination_class = DefaultResultsSetPagination
  #paginate_by = 20

  def get_serializer_context(self):
     return {'user': self.request.user}

  def get_queryset(self):
    filter = super().get_queryset()
    search = self.request.GET.get('search')
    start_date = self.request.GET.get('dates__start_date')
    category = self.request.GET.get('category')
    genre = self.request.GET.get('genre')
    prices = self.request.GET.get('prices')
    ordering = self.request.GET.get('ordering')
    user = self.request.GET.get('user')
    is_admin = self.request.GET.get('is_admin')

    #print('is_admin', is_admin)

    if genre:
      genre = genre.split(",")
      filter = filter.filter(genre__in=genre)

    if not is_admin or not self.request.user.is_authenticated or is_admin and self.request.user.role != 'admin':
      filter = filter.filter(status__in=[1,4], dates__is_deleted=False, dates__finish_date__gt=datetime.datetime.now())

    if prices:
      prices = json.loads(prices)
      if len(prices) == 2:
        filter = filter.filter(Q(prices__price__gte=prices[0]) & Q(prices__price__lte=prices[1]))

    if search:
      filter = filter.filter(Q(name__contains=search) | Q(name__contains=search.capitalize()))
    
    if start_date:
      date_to = False
      try:
        date_to = datetime.datetime.strptime(start_date, '%Y-%m-%d')
      except Exception:
        pass

      if date_to:
        date_to = date_to + datetime.timedelta(days=1)
        filter = filter.filter(dates__is_deleted=False, dates__start_date__gte=start_date, dates__start_date__lte=date_to)

    if category:
      filter = filter.filter(type__code=category)
      #print('filter', filter.query)

    if ordering:
      
      try:
        filter = filter.annotate(order=Max(ordering)).order_by('order')
      except Exception:
        pass

    else:
      filter = filter.annotate(date=Max('dates__start_date')).order_by('date')
    
    filter = filter.distinct()

    return filter

  def create(self, request, *args, **kwargs):
    return Response({
      'results': "В доступе отказано"
    }, 400)

  def update(self, request, *args, **kwargs):
    return Response({
      'results': "В доступе отказано"
    }, 400)

  def retrieve(self, request, *args, **kwargs):
    item = Events.objects.get(pk=kwargs['pk'])
    item = EventSerializer(item)

    return Response({
      'results': item.data
    })

#Метод для создания мероприятия для авторизированных пользователей
@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def CreateEvent(request):
  count = Events.objects.filter(user=request.user, created_at__gt=(datetime.datetime.now() - timedelta(minutes=1))).count()
  
  #print('count', count)

  if count > 0:
    return Response({
      'results': False
    })

  data = configuration(request, Events)

  serialize = EventSerializer()
  serialize.validate(attrs=request.data)

  data = configurate(request, data)
  type = data['type']
  genre = data['genre']
  data['user'] = request.user
  #serialize = EventSerializer(data=data)
  #serialize.is_valid(raise_exception=True)

  # try:
  #   del data['type']
  # except Exception:
  #   pass

  try:
    del data['genre']
  except Exception:
    pass

  try:
    del data['afisha']
  except Exception:
    pass

  try:
    del data['preview']
  except Exception:
    pass

  try:
    del data['stage_image']
  except Exception as ee:
    pass

  try:
    del data['id']
  except Exception as ee:
    pass

  payment = None

  try:
    if request.data.get('payment'):
      payment = data['payment']
      del data['payment']
  except Exception as p:
    print('payment', p)
    pass


  try:
    event = Events.objects.create(**data)
    # if type and len(type) > 0:
    #   event.type.set(type)
    #   event.save()

    if genre and len(genre) > 0:
      event.genre.set(genre)
      event.save()
    
    Logging.objects.create(action=f"Добавлено мероприятие №{event.pk}", user=request.user)
    GrabAllData(request, event)
    EventUploadeManager(request, event)

    try:
      event.payment.add(payment)
      event.save()

    except Exception:
      pass

    return Response({
      'results': event.pk
    })

  except Exception as err:
    print('err', err)
    log = Logging.objects.create(action=f"{err}", user=request.user)
    return Response({
      'results': f"При создании мероприятия возникла ошибка №{log.pk}, обратитесь к администратору и укажите номер ошибки!"
    }, 400)


#Метод для обновления данных мероприятия
@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def UpdateEvent(request, pk):

  can = False
  event = None

  try:
    event = Events.objects.get(pk=pk)
    if event.user.pk == request.user.pk or request.user.role == 'admin':
      can = True
  except Exception:
    return Response({
      'results': 'Ошибка при получении мероприятия'
    }, 400)

  if not can:
    return Response({
      'results': 'В доступе отказано'
    }, 400)
  
  data = configuration(request, Events)

  preview = request.data.get('preview')
  afisha = request.data.get('afisha')
  stage_image = request.data.get('stage_image')
  payment = request.data.get('payment')
  status = request.data.get('status')

  #print('paymentpayment', payment)

  if preview:
    try:
      del data['preview']
    except Exception:
      pass

  if afisha:
    try:
      del data['afisha']
    except Exception:
      pass

  try:
    del data['stage_image']
  except Exception:
    pass

  try:
    del data['id']
  except Exception:
    pass

  data = configurate(request, data)

  # try:
  #   type = data['type']
  # except Exception:
  #   if not status:
  #     return Response({
  #       'results': 'Не указан тип мероприятия'
  #     }, 400)
  
  try:
    status = data['status']
    del data['status']
  except Exception:
    return Response({
      'results': 'Не указан статус мероприятия'
    }, 400)
  
  try:
    genres = data['genre']
  except Exception:
    if not status:
      return Response({
        'results': 'Не указан жанр мероприятия'
      }, 400)
  
  try:
    del data['genre']
  except Exception:
    pass

  # try:
  #   del data['type']
  # except Exception:
  #   pass

  if payment:
    print('pppppppp', payment)
    try:
      payment = data['payment']
      del data['payment']
    except Exception as p:
      print('payment err', p)
      pass

  print('data', data)

  try:
    #ev = Events.objects.filter(pk=pk).update(**data)

    for d in data:
      setattr(event, d, data[d])

    event.save()

    # try:
    #   if event.type.filter(pk__in=[type.pk for type in types]).count() != len(types):
    #     for t in event.type.all():
    #       event.type.remove(t)
    #     event.save()
    #   event.type.set(types)
    #   event.save()
    # except Exception as e:
    #   print('update type err', e)
    #   pass

    try:
      if event.genre.filter(pk__in=[genre.pk for genre in genres]).count() != len(genres):
        for t in event.genre.all():
          event.genre.remove(t)

        event.save()
      event.genre.set(genres)
      event.save()
    except Exception as e:
      print('update genre err', e)
      pass

    if payment:
      print('payment', payment)
      try:
        if len(event.payment.filter(pk=payment.pk)) == 0:
          for pay in event.payment.all():
            event.payment.remove(pay)
          event.save()

          event.payment.add(payment)
          event.save()

          # if len(event.payment.exclude(pk=payment.pk)) > 0:
          #   for p in event.payment.exclude(pk=payment.pk):
          #     event.remove(p)

          #   event.save()

      except Exception as p:
        print('payment res err', p)
        pass

    if preview and ifValidateFile(preview):
      preview = FileUploader(preview)
      event.preview = preview
      event.save()

    if afisha and ifValidateFile(afisha):
      afisha = FileUploader(afisha)
      event.afisha = afisha
      event.save()


    try:
      if stage_image:
        try:
          stage_image = json.loads(stage_image)

          ids = []

          if len(stage_image) > 0:
            for image in stage_image:
              try:
                if image['id'] and int(image['id']) > 0:
                  ids.append(image['id'])
              except Exception:
                pass
          else:
            items = event.stage_image.all()
            for item in items:
              event.stage_image.remove(item)

            event.save()

          if len(ids) > 0:
            items = event.stage_image.exclude(pk__in=ids)

            for item in items:
              r = event.stage_image.remove(item)

            if len(items) > 0:
              event.save()

          files = MultiFileUploader(request, "stage_image")

          if len(files) > 0:
            for file in files:
              if event.stage_image.filter(pk=file.pk).count() == 0:
                event.stage_image.add(file)

            event.save()
        except Exception:

          items = event.stage_image.all()
          for item in items:
            event.stage_image.remove(item)

          #print('stage_image dir', dir(stage_image))
          if ifValidateFile(stage_image):
            file = FileUploader(stage_image)

            #print('filefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefile', file)

            event.stage_image.add(file)
            event.save()

        #print('stage_image', stage_image)

    except Exception as e:
      print('stage image err', e)
      pass

    if status and status.pk != event.status.pk and request.user.role == 'admin':
      print('here', status)
      event.status = status
      event.save()
      

  except Exception as err:
    log = Logging.objects.create(action=f"{err}", user=request.user)
    
    return Response({
      'results': f"При обновлении мероприятия возникла ошибка №{log.pk}, обратитесь к администратору и укажите номер ошибки!"
    }, 400)

  return Response({
    'results': True
  })


#Метод для получения списка статусов мероприятий
class EventStatusListView(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]
  authentication_classes = []
  ordering_fields = ["name"]
  filterset_fields = '__all__'
  search_fields = ["name"]

  queryset = EventStatus.objects.all()
  serializer_class = StatusSerializer
  paginate_by = 20


#Метод для получения списка жанра мероприятий
class EventGenreViewSet(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["name"]
  filterset_fields = '__all__'
  search_fields = ["name"]
  ordering = ["name"]

  queryset = EventGenre.objects.all()
  serializer_class = GenreSerializer
  paginate_by = 100


#Метод для работы с CRUD для жанра мероприйтий для роли админа
class EventGenreAdminViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminUser]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["name"]
  filterset_fields = '__all__'
  search_fields = ["name"]
  ordering = ["name"]

  queryset = EventGenre.objects.all()
  serializer_class = GenreSerializer
  paginate_by = 100

  def create(self, request, *args, **kwargs):
    #super().create(request, *args, **kwargs)
    data = configuration(request, EventGenre)

    GenreSerializer.is_validated(attrs=data)

    EventGenre.objects.create(**data)

    return Response({
      'results': True
    })

  def update(self, request, *args, **kwargs):
    
    data = configuration(request, EventGenre)

    EventGenre.objects.filter(pk=kwargs['pk']).update(**data)

    return Response({
      'results': True
    })

  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    return Response({
      'results': data.__dict__.get('data')
    })


#Метод для получения List and Retrieve схем для пользователей всех ролей
class EventAreaViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["name"]
  filterset_fields = ['city']
  search_fields = ["name"]

  queryset = EventArea.objects.all()
  serializer_class = EventAreaSerializer
  pagination_class = LargeResultsSetPagination

  def retrieve(self, request, *args, **kwargs):
    item = super().retrieve(request, *args, **kwargs)
    data = item.__dict__

    return Response({
      'results': data.get('data')
    })

  def create(self, request, *args, **kwargs):
    return Response({
      'results': 'В доступе отказано'
    }, 400)

  def update(self, request, *args, **kwargs):
    return Response({
      'results': 'В доступе отказано'
    }, 400)


#Метод для получения списка возрастов доступных для мероприятия
class EventAgeViewSet(generics.ListAPIView):
  permission_classes = [permissions.AllowAny]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  ordering_fields = ["name"]
  filterset_fields = '__all__'
  search_fields = ["name"]

  queryset = EventAge.objects.all()
  serializer_class = EventAgeSerializer
  paginate_by = 20


#Метод для работы с CRUD для типов мероприятий для авторизированного пользователя
class EventTypeViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = EventType.objects.all()
  serializer_class = TypeSerializer
  paginate_by = 20
  
  # def get_queryset(self):
  #   filter = super().get_queryset()
  #   filter = filter.filter(user=self.request.user)

  #   return filter

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = TypeSerializer(data=data)
    
    try:
      EventType.objects.filter(pk=kwargs.get('pk')).update(**data)
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
    request.data.setdefault('user', request.user)
    data = request.data
    validate = TypeSerializer(data=data)

    try:
      EventType.objects.create(**data)
    except Exception:
      validate.is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })


#Метод для работы с CRUD для цен мероприятия для авторизированного пользователя
class EventPriceViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [authentication.TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = EventPrice.objects.all()
  serializer_class = EventPriceSerializer
  pagination_class = LargeResultsSetPagination
  
  def get_queryset(self):
    filter = super().get_queryset()
    filter = filter.filter(user=self.request.user)
    filter = filter.filter(is_deleted=False)

    event = self.request.GET.get('event__pk')

    filter = EventParamConfigurate(event, filter)
    return filter

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = EventPriceSerializer(data=data)
    
    try:
      EventPrice.objects.filter(pk=kwargs.get('pk')).update(**data)
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
    [event, data] = ConfigurateEventData(request, EventPrice)

    try:
      item = EventPrice.objects.create(**data)

      if event:
        item.event.add(event)
        item.save()

    except Exception as e:
      print('eee', e)
      EventPriceSerializer(data=data).is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })


  def destroy(self, request, *args, **kwargs):

    try:
      EventPrice.objects.filter(pk=kwargs['pk']).update(is_deleted=True)
    except Exception:
      pass
    
    return Response({
      'results': True
    })


#Мето для работы CRUD для категорий меропритий для авторизированного пользователя
class EventAreaCategoryViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [authentication.TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = EventAreaCategory.objects.all()
  serializer_class = EventAreaCategorySerializer
  paginate_by = 20
  
  def get_queryset(self):
    filter = super().get_queryset()
    filter = filter.filter(user=self.request.user)
    filter = filter.filter(is_deleted=False, active=True)

    event = self.request.GET.get('event__pk')

    filter = EventParamConfigurate(event, filter)

    return filter

  def update(self, request, *args, **kwargs):
    data = request.data
    validate = EventAreaCategorySerializer(data=data)
    
    try:
      EventAreaCategory.objects.filter(pk=kwargs.get('pk')).update(**data)
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
    [event, data] = ConfigurateEventData(request, EventAreaCategory)

    try:
      item = EventAreaCategory.objects.create(**data)

      if event:
        item.event.add(event)
        item.save()

    except Exception:
      EventAreaCategorySerializer(data=data).is_valid(raise_exception=True)
    
    return Response({
      'results': True
    })


  def destroy(self, request, *args, **kwargs):

    try:
      EventAreaCategory.objects.filter(pk=kwargs['pk']).update(is_deleted=True)
    except Exception:
      pass
    
    return Response({
      'results': True
    })


#Метод для работы с CRUD для шаблонов для печати мероприятия для авторизированного пользователя
class EventMailTemplateSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [TokenAuthentication]

  queryset = EventMailTemplate.objects.all()
  serializer_class = EventMailTemplateSerializer
  paginate_by = 20
  
  def get_queryset(self):
    filter = super().get_queryset()
    filter = filter.filter(user=self.request.user)

    event = self.request.GET.get('event')
    #print('event', event)

    filter = EventParamConfigurate(event, filter)

    return filter

  def update(self, request, *args, **kwargs):
    data = configuration(request, EventMailTemplate)
    
    if data['image']:
      if isinstance(data['image'], InMemoryUploadedFile):
        data['image'] = FileUploader(data['image'])
      else:
        del data['image']
    
    validate = EventMailTemplateSerializer(data=data)

    try:
      EventMailTemplate.objects.filter(pk=kwargs.get('pk')).update(**data)
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
    [event, data] = ConfigurateEventData(request, EventMailTemplate)

    image = request.data.get('image')

    try:
      del data['image']
    except Exception:
      pass

    id = 0
    try:
      mail = EventMailTemplate.objects.create(**data)
      id = mail.pk

      if event:
        mail.event = event
        mail.save()

      if image:
        if isinstance(image, InMemoryUploadedFile):
          mail.image = FileUploader(image)
          mail.save()

    except Exception as e:
      print('e', e)
      EventMailTemplateSerializer(data=data).is_valid(raise_exception=True)
    
    return Response({
      'results': id
    })


#Метод для получения списка избранного мероприятий для текущего пользователя
@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def FavoriteView(request):
  favorites = []

  type = request.GET.get('type')
  search = request.GET.get('search')
  if request.user.is_authenticated:
    favorites = EventFavorite.objects.filter(user=request.user)
    if type:
      favorites = favorites.filter(event__type=type)

    if search:
      favorites = favorites.filter(Q(event__name__icontains=search) | Q(event__name__istartswith=search.capitalize()))
    
    favorites = [favorite.event for favorite in favorites]
  
  events = EventSerializer(favorites, many=True, context={'user': request.user})

  return Response({
    'results': events.data
  })


#Метод для работы с добавлением и удалением избранных мероприятий для авторизированного пользователя
@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def EventFavoriteView(request):
  response = False
  responseText = None

  if request.user.is_authenticated:
    id = request.GET.get('id')
    try:
      event = Events.objects.get(pk=id)
      favorites = EventFavorite.objects.filter(user=request.user, event=event)
      if len(favorites) > 0:
        for fav in favorites:
          fav.delete()
        responseText = 'removing'
        response = True
      else:
        favorite = EventFavorite.objects.create(user=request.user, event=event)
        favorite.save()
        responseText = 'adding'
        response = True

    except Exception as e:
      pass

  return Response({
    'results': {
      'stateText': responseText,
      'state': response
    }
  })


#Метод для конфигурации и обработки данных для схем мероприятия на этапе создания или обновления мероприятия в личном кабинете
@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([IsNoViewer])
def OrgSchemeManagerView(request):
  dates = request.data.get('dates')
  values = request.data.get('values')
  categories = request.data.get('categories')
  event = request.data.get('event')
  user = request.data.get('user')
  scheme = request.data.get('scheme')

  if request.user.role == 'admin' and user:
    if isinstance(user, int):
      try:
        user = User.objects.get(pk=user)
      except Exception:
        user = request.user
  else:
    user = request.user

  if scheme:
    sch = EventAreaSchems.objects.filter(pk=scheme)
    if len(sch) > 0:
      scheme = sch[0]
    else:
      scheme = False

  else:
    scheme = False

  if scheme:
    if event:
      ev = Events.objects.filter(user=user, pk=event)

      if len(ev) > 0:
        event = ev[0]
      else:
        event = None

    else:
      event = None

    if len(dates) > 0:
      for date in dates:
        try:
          date = EventDate.objects.get(pk=date, user=user)
          
          if date.schemes.filter(pk=scheme.pk).count() > 0:
            date.schemes.filter(pk=scheme.pk).delete()
            date.save()

          date.schemes.add(scheme)
          date.save()

        except Exception as e:
          print('date error', e)
          pass

    if len(values) > 0:
      prices = EventPrice.objects.filter(event=event, place__scheme=scheme)
      if len(prices) > 0:
        for pr in prices:
          for pl in pr.place.filter(scheme=scheme.pk):
            pr.place.remove(pl)
          
          pr.save()

      for val in values:
        try:
          price = EventPrice.objects.get(pk=val['price_id'], event=event, user=user)
          place = EventAreaPlaces.objects.get(pk=val['place_id'])
          
          price.place.add(place)
          price.save()

          if price.schemes.filter(pk=scheme.pk).count() == 0:
            price.schemes.add(scheme)
            price.save()

        except Exception as e:
          print('val error', e)
          pass

    if len(categories) > 0:
      for cat in categories:
        try:
          cat = EventAreaCategory.objects.get(pk=cat, user=user)

          if cat.scheme.filter(pk=scheme.pk).count() == 0:
            cat.scheme.add(scheme)
            cat.save()

        except Exception as e:
          print('cat error', e)
          pass


  return Response({
    'results': True
  })


#Метод для конфигурации и обработки данных для схем мероприятия на этапе создания или обновления мероприятия в личном кабинете
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def SellInfoManagerView(request):
  date = request.data.get('date')
  event = request.data.get('event')
  scheme = request.data.get('scheme')

  if scheme:
    try:
      scheme = EventAreaSchems.objects.get(pk=scheme)
    except Exception as s:
      print('scheme sell_info err', s)
      scheme = False

  # if not scheme:
  #   return Response({
  #     'results': 'Не указана схема'
  #   }, 400)


  if date:
    try:
      date = EventDate.objects.get(pk=date)
    except Exception:
      date = False

  if not date:
    return Response({
      'results': 'Не указана дата'
    }, 400)


  if event:
    try:
      event = Events.objects.get(pk=event)
    except Exception:
      event = False

  if not event:
    return Response({
      'results': 'Не указано мероприятие'
    }, 400)

  if scheme:
    prices = EventPriceSerializer(EventPrice.objects.filter(event=event, schemes=scheme, is_deleted=False), context={'date': date, 'event': event}, many=True)
    categories = EventAreaCategorySerializer(EventAreaCategory.objects.filter(event=event, active=True, scheme=scheme, is_deleted=False), context={'date': date, 'event': event}, many=True)
  else:
    prices = EventPriceSerializer(EventPrice.objects.filter(event=event, is_deleted=False), context={'date': date, 'event': event}, many=True)
    categories = EventAreaCategorySerializer(EventAreaCategory.objects.filter(event=event, active=True, is_deleted=False), context={'date': date, 'event': event}, many=True)

  return Response({
    'results': {
      'prices': prices.data,
      'categories': categories.data
    }
  })
