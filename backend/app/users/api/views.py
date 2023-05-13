from hashlib import md5
from time import time
from rest_framework.response import Response
from rest_framework import viewsets, generics, filters, views, authentication, permissions
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework import parsers, renderers
from rest_framework import status
from rest_framework.compat import coreapi, coreschema
from rest_framework.schemas import ManualSchema
from rest_framework.schemas import coreapi as coreapi_schema
from .serializers import *
from django.db.models import Q
from app.users.models import User
from rest_framework.authtoken.models import Token
from utils.token import *
from utils.function import *
from django_filters.rest_framework import DjangoFilterBackend
from utils.permission import *
from utils.mail import mail
from app.events.models import Events
from django.conf import settings
from django_telegram_login.authentication import verify_telegram_authentication
from django_telegram_login.errors import (
    NotTelegramDataError, 
    TelegramDataIsOutdatedError,
)
from .function import *
from utils.sms import SMS


#Пользователи чекина
class UserCheckerViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [authentication.TokenAuthentication]

  queryset = UserChecker.objects.all()
  serializer_class = UserCheckerSerializer
  paginate_by = 50
  
  def get_queryset(self):
    filter = super().get_queryset()
    filter = filter.filter(user=self.request.user)

    return filter

  def update(self, request, *args, **kwargs):
    request.data.setdefault('user', request.user.id)
    data = request.data
    validate = UserCheckerSerializer(data=data)
    
    try:
        UserChecker.objects.filter(pk=kwargs.get('pk')).update(**data)
    except Exception:
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
    request.data.setdefault('user', request.user.id)
    data = request.data
    validate = UserCheckerSerializer(data=data)
    validate.is_valid(raise_exception=True)
    password = data.get('password')
    data['password'] = hash(password)
    data['user'] = request.user
    
    UserChecker.objects.create(**data)
    
    return Response({
      'results': True
    })

#Форма авторизации
class AuthUserAuthView(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    serializer_class = AuthUserSerializer
    queryset = User.objects.all()

    if coreapi_schema.is_enabled():
        schema = ManualSchema(
            fields=[
                coreapi.Field(
                    name="login",
                    required=True,
                    location='form',
                    schema=coreschema.String(
                        title="Login",
                        description="Валидный логин для авторизации",
                    ),
                ),
                coreapi.Field(
                    name="password",
                    required=True,
                    location='form',
                    schema=coreschema.String(
                        title="Password",
                        description="Валидный пароль для авторизации",
                    ),
                ),
            ],
            encoding="application/json",
        )
    def list(self, request, *args, **kwargs):
        return Response({
            'results': []
        })

    def update(self, request, *args, **kwargs):
        data = {}
        user = request.user
        updated = False
        for field in request.data:
            if not field == 'password' \
                and not field == "login" \
                and not field == 'photo' \
                and not field == 'role':
                try:
                    value = request.data.get(field)
                    if User._meta.get_field(field) and value != getattr(user, field):
                        updated = True
                        data[field] = value
                except Exception as e:
                    pass

            if field == 'photo':
                file = FileUploader(request.data.get(field))
                
                if file:
                    updated = True
                    data[field] = file
                
        if updated:
            try:
                pk = user.pk
                if user.role == 'admin':
                    pk = kwargs['pk']

                User.objects.filter(pk=pk).update(**data)
            except Exception as e:
                print('user e', e)

        return Response({
            'results': updated
        })

    def get_serializer_context(self):
        return {
           'request': self.request,
           'format': self.format_kwarg,
           'view': self
        }

    def get_object(self):
        obj = super().get_object()

        if self.request.user.pk == obj.pk:
            return obj
        else:
            return {}

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return self.serializer_class(*args, **kwargs)

    @action(detail=False, methods=['post'], permission_classes=(permissions.AllowAny,))
    def auth(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.update_or_create(user=user)
        return Response({'results': {'token': token.key}})

#Форма регистрации
class RegisterView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
      serializer = self.get_serializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      user = User.objects.get(login=serializer.data['login'])
      
      data = {
        'is_active': True,
        'is_email_validated': False
      }

      if user.email:
        key = generate_key(user.email)
        data['activation_key'] = key
        subject = f"Подтверждение пароля на сайте {settings.LOCAL_URL}"
        message = f'''
          <p>Вы успешно зарегистрировались на сайте <a href="{settings.LOCAL_URL}">{settings.LOCAL_URL}</a></p>
          <p>Перейдите по ссылке для подтверждения регистрации <a href="{settings.LOCAL_URL}/confirmEmail?user={user.pk}&activation_key={key}">активировать аккаунт</a></p>
          <p>Если это были не вы, то проигнорируйте это сообщение</p>
        '''
        mail(recepients=[user], subject=subject, message=message, html=True)

      User.objects.filter(pk=user.pk).update(**data) 

      headers = self.get_success_headers(serializer.data)
      return Response({'results': user.pk}, status=status.HTTP_201_CREATED, headers=headers)


#Получение данных аторизированного пользователя
@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def GetCurrentUser(request):
  user = UserSerializer(request.user)
  return Response({
      'results': user.data
  })

#Форма изменения пароля
@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def ChangePassword(request):
    changed = False
    request.data['login'] = request.user.login

    serializer = AuthUserSerializer(data=request.data)

    if serializer.validateAccountChangePassword(request.data):
        request.user.set_password(request.data['password'])
        changed = True

    return Response({
        'results': changed
    })


def SetUserFilter(filter, self):
    search = self.request.GET.get('search')
    
    if search:
        filter = filter.filter(
            Q(login__contains=search) |
            Q(email__contains=search) |
            Q(phone__contains=search) |
            Q(username__contains=search) |
            Q(surname__contains=search) |
            Q(lastname__contains=search) |
            Q(legal_first_name__contains=search) |
            Q(legal_name__contains=search) |
            Q(legal_last_name__contains=search)
        )

    return filter

#Метод для обновления данных пользователя для для ролей организатор и админ
class NoViewerUserUpdate(generics.UpdateAPIView):
  permission_classes = [IsNoViewer]
  authentication_classes = [TokenAuthentication]

  queryset = User.objects.all()
  serializer_class = UserSerializer

  def update(self, request, *args, **kwargs):
    try:
      user = User.objects.get(pk=kwargs['pk'])

      if request.user.role == 'admin' or request.user.role == 'manager' and user.role == 'viewer':
        data = request.data
        User.objects.filter(pk=kwargs['pk']).update(**data)   

    except Exception as us:
      pass

    return Response({
      'results': True
    })

#Метод для получения данных о пользователе для для ролей организатор и админ
class NoViewerUserViewSet(generics.RetrieveAPIView):
  permission_classes = [IsNoViewer]
  authentication_classes = [TokenAuthentication]

  queryset = User.objects.all()
  serializer_class = UserSerializer

  def retrieve(self, request, *args, **kwargs):
    data = super().retrieve(request, *args, **kwargs)

    return Response({
      'results': data.__dict__.get('data')
    })

#Метод для обработки данных CRUD для роли админа
class AdminUserViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminUser]
  authentication_classes = [TokenAuthentication]
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
  filterset_fields = '__all__'

  queryset = User.objects.all()
  serializer_class = UserSerializer
  paginate_by = 50

  
  def get_queryset(self):
    filter = super().get_queryset()

    event = self.request.GET.get('event')

    if event:
      events = Events.objects.filter(pk=event).values_list('user__pk')
      if len(events) > 0:
        filter = filter.filter(pk__in=events)

    
    return SetUserFilter(filter=filter, self=self)

  def retrieve(self, request, *args, **kwargs):
    detail = super().retrieve(request, *args, **kwargs)
    
    data = detail.__dict__.get('data')

    return Response({
      'results': data
    })


#Авторизация проверяющего мобильное приложение
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def AuthChecker(request):
  login = request.data.get('login')
  password = request.data.get('password')

  if not login:
    return Response({
      'results': 'Не указан логин'
    }, 400)

  try:
    login = login.lower()
  except Exception:
    pass

  if not password:
    return Response({
      'results': 'Не указан пароль'
    }, 400)

  try:
    password = password.lower()
  except Exception:
    pass

  try:
    user = UserChecker.objects.get((Q(login=login) | Q(email=login) | Q(phone=login)) & Q(password=hash(password)))
    token = TokenCheckers.objects.get(user=user)

    return Response({
      'results': {'token': token.key}
    })
  except Exception:
    return Response({
      'results': 'Неверный логин или пароль'
    }, 400)


#Авторизация проверяющего мобильное приложение
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def AuthRestoreChecker(request):
  email = request.data.get('email')
  user = False

  try:
    user = UserChecker.objects.get(email=email)
  except Exception:
    pass

  if user:
    passw = generate_code()
    user.password = hash(passw)
    user.save()
    
    subject = f"Восстановление пароля на сайте {settings.LOCAL_URL}"
    message = f'''
      <p>Вы успешно сбросили пароль на сайте <a href="{settings.LOCAL_URL}">{settings.LOCAL_URL}</a></p>
      <p>Ваш новый пароль: {passw}</p>
    '''
    mail(recepients=[user], subject=subject, message=message, html=True)


  if not email:
    return Response({
      'results': 'Не указана почта'
    }, 400)

  return Response({
    'results': True
  })


#Получение данных аторизированного проверяющего
@api_view(['GET'])
@authentication_classes([TokenCheckersAuthentication])
@permission_classes([IsUserChecker])
def GetCurrentChecker(request):
  user = UserCheckerSerializer(request.user)
  return Response({
    'results': user.data
  })


#Авторзиация через телеграм
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def TelegramAuth(request):
  if not request.data.get('hash'):
    return Response({
      'results': 'Неверный хеш'
    }, 400)
  try:
    data = request.data

    result = verify_telegram_authentication(
      bot_token=settings.TELEGRAM_BOT_TOKEN, request_data=data
    )

    token = CreateOrUpdateSocialUser(request=request, login=f"telegram_{result['id']}", password=f"{result['id']}_111221")

    return Response({
      'results': str(token)
    })

  except TelegramDataIsOutdatedError as e:
    print('TelegramDataIsOutdatedError', e)
    return Response({
      'results': 'Срок авторизации был произведен больше 1 дня назад'
    }, 400)
  except NotTelegramDataError as e:
    print('NotTelegramDataError', e)
    return Response({
      'results': 'Некорректные данные авторизации'
    }, 400)
  

#Авторзиация через телеграм
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def VKAuth(request):
  try:
    key = settings.VK_SECRET
    data = request.data
    check_str = "".join(
      item + "=" + data[item] for item in ["expire", "mid", "secret", "sid"]
    )
    hash = md5((check_str + key).encode("utf-8")).hexdigest()
    if hash != data["sig"] or int(data["expire"]) < time():
      return Response({
        'results': 'Данные авторизации неверные'
      }, 400)
    
    token = CreateOrUpdateSocialUser(request=request, login=f"vk_{data['mid']}", password=f"{data['mid']}_111221")

    return Response({
      'results': str(token)
    })

  except Exception as e:
    print('vk err', e)
    return Response({
      'results': 'Данные авторизации неверные'
    }, 400)
  

#Авторзиация через телеграм
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def ActivateAccount(request, pk):
  try:
    user = User.objects.get(pk=pk, activation_key=request.data.get('activation_key'))

    User.objects.filter(pk=pk).update(is_active=True, activation_key=None)
    
    return Response({
      'results': True
    })
  except Exception as e:
    print('account activate err', e)

    return Response({
      'results': 'Неверные данные активации аккаунта'
    }, 400)
  

#Авторзиация через телеграм
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def RecoveryFirst(request):
  try:
    user = User.objects.get(email=request.data.get('email'))
    key = generate_key(user.email)
    subject = f"Востановление пароля на сайте {settings.LOCAL_URL}"
    message = f'''
      <p>Перейдите по ссылке для востановления пароля <a href="{settings.LOCAL_URL}/recoverySecond?user={user.login}&recovery_key={key}">востановить пароль</a></p>
      <p>Если это были не вы, то проигнорируйте это сообщение</p>
    '''

    mail(recepients=[user], subject=subject, message=message, html=True)

    User.objects.filter(pk=user.pk).update(recovery_key=key)


  except Exception as e:
    print('recovery err', e)
    pass

  return Response({
    'results': True
  })


#Авторзиация через телеграм
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def RecoverySecond(request):
   
  try:
    password = request.data.get('password')
    confirmPassword = request.data.get('confirmPassword')

    if password != confirmPassword:
      return Response({
        'results': 'Пароли несовпадают'
      }, 400)

    login = request.data.get('user')
    recovery_key = request.data.get('recovery_key')

    # print('login', login)
    # print('recove', recovery_key)

    user = User.objects.get(login=login, recovery_key=recovery_key)

    User.objects.filter(pk=user.pk).update(recovery_key=None)

    make_pass(user=user, password=password)

    return Response({
      'results': True
    })

  except Exception as e:
    print('rec err', e)
    return Response({
      'results': 'Неверные данные для восстановления пароля'
    }, 400)
  

#Отправка смс кода пользователю
@api_view(['POST'])
@permission_classes([permissions.BasePermission])
@authentication_classes([TokenAuthentication])
def SendSms(request, pk):
  try:
    user = User.objects.get(pk=pk)

    if user.phone:
      code = str(generate_code())
      SMS.sendSMS(user.phone, f"Код: {code}")

      User.objects.filter(pk=user.pk).update(smscode=code)

    return Response({
      'results': True
    })  
  except Exception as e:
    print('errr sender', e)
    pass

  return Response({
    'results': True
  })

#Проверка смс кода пользователя
@api_view(['POST'])
@permission_classes([permissions.BasePermission])
@authentication_classes([TokenAuthentication])
def CheckSms(request, pk):
  
  try:
    code = request.data.get('code')
    user = User.objects.get(pk=pk)

    if str(user.smscode) == str(code):
      User.objects.filter(pk=user.pk).update(is_active=True, smscode=None)

      return Response({
        'results': True
      })
    
  except Exception:
    pass
  
  return Response({
    'results': False
  })

#Восстановление пароля через телефон
@api_view(['POST'])
@permission_classes([permissions.BasePermission])
@authentication_classes([TokenAuthentication])
def RecoveryPhone(request):
  
  phone = request.data.get('phone')

  if phone:
    user = User.objects.filter(Q(login=phone) | Q(phone=phone))
    if len(user) > 0:
      user = User.objects.get(pk=user[0].pk)

      phone = user.phone if user.phone else user.login  
      
      password = generate_pass()
      make_pass(user=user, password=password)
      SMS.sendSMS(phone, f"Ваш новый пароль: {password}")

      return Response({
        'results': True
      })

  return Response({
    'results': False
  })