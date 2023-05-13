import re
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from app.users.models import *
from app.images.api.serializers import *
from app.geo.api.serializers import *

class AuthUserSerializer(serializers.ModelSerializer):
  login = serializers.CharField(
    label="Login",
    write_only=True
  )
  password = serializers.CharField(
    label="Password",
    style={'input_type': 'password'},
    trim_whitespace=False,
    write_only=True
  )
  token = serializers.CharField(
    label="Token",
    read_only=True
  )

  def authenticate(self, user: User, password):
    if user.check_password(password):
      return user
    
    return None

  def validateAccountChangePassword(self, attrs):
    login = attrs.get('login')
    oldpass = attrs.get('oldpass')
    password = attrs.get('password')
    confirmPassword = attrs.get('confirmPassword')

    result = False

    if login and oldpass and password == confirmPassword:
      user = authenticate(request=self.context.get('request'),
                          login=login, password=oldpass)
      if not user:
        msg = "Старый пароль неверный"
        raise serializers.ValidationError(msg, code='authorization')
      
      try:
        validate_password(password=password)
      except Exception as errs:
        for err in errs:
          raise serializers.ValidationError(err, code='authorization')

      result = True

    else:
      if not oldpass:
        msg = "Не введен старый пароль"
        raise serializers.ValidationError(msg, code='authorization')

      if not password:
        msg = "Не введен новый пароль"
        raise serializers.ValidationError(msg, code='authorization')
      
      if not confirmPassword:
        msg = "Повторный пароль не введен"
        raise serializers.ValidationError(msg, code='authorization')

      if password != confirmPassword:
        msg = "Пароли не совпадают"
        raise serializers.ValidationError(msg, code='authorization')         
    
    return result
  
  def validate(self, attrs):
    login = attrs.get('login')
    password = attrs.get('password')

    if not re.search('@', str(login)):
      login = re.sub(r'[^0-9]', '', str(login))

      if login[0] != '7':
        login = '7' + login

    if login and password:
      user = authenticate(request=self.context.get('request'),
                          login=login, password=password)
      
      if not user:
        try:
          u = User.objects.get(email=login)
          user = self.authenticate(user=u, password=password)
        except Exception as e:
          pass
        
      if not user:
        try:
          u = User.objects.get(phone=login)
          user = self.authenticate(user=u, password=password)
        except Exception as e:
          pass

      if not user:
        msg = "Неверные данные авторизации"
        raise serializers.ValidationError(msg, code='authorization')
      #elif user and not user.is_active:
      #  msg = "Пользователь был удален из системы, обратитесь в администрацию для получения информации."
      #  raise serializers.ValidationError(msg, code='authorization')
    else:
      msg = "Переданы неверные поля авторизации"
      raise serializers.ValidationError(msg, code='authorization')

    attrs['user'] = user
    return attrs

  class Meta:
    model = User
    exclude = ('last_login', 'is_email_validated', 'activation_key', 'user_permissions', 'groups')


class RegisterSerializer(serializers.ModelSerializer):
  login = serializers.CharField(
    required=True,
    validators=[UniqueValidator(queryset=User.objects.all())]
  )

  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  confirmPassword = serializers.CharField(write_only=True, required=True)

  class Meta:
    model = User
    fields = ('login', 'username', 'surname', 'birthday', 'password', 'confirmPassword', 'email')
    extra_kwargs = {
      'login': {'required': True},
    }

  def validate(self, attrs):
    if attrs['password'] != attrs['confirmPassword']:
      raise serializers.ValidationError({"password": "Пароли не совпадают"})

    return attrs

  def create(self, validated_data):
    data = {}
    fields = self.context['request'].data
    for field in fields:
      if not field == 'password' or not field == 'role':
        try:
          if User._meta.get_field(field):
            data[field] = fields[field]
        except Exception as e:
          pass

    if data['phone']:
      d = User.objects.filter(phone=data['phone'])
      if len(d) > 0:
        raise serializers.ValidationError({"non_field_errors": ["Пользователь с таким телефоном существует"]})


    if data['email']:
      d = User.objects.filter(email=data['email'])
      if len(d) > 0:
        raise serializers.ValidationError({"non_field_errors": ["Пользователь с такой почтой существует"]})

    user = False
    try:
      user = User.objects.create(**data)
      user.set_password(validated_data['password'])
      user.save()
    except Exception as e:
      print('register err', e)
      raise serializers.ValidationError({"non_field_errors": ["Произошла неизвестная ошибка при регистрации"]})

    return user

class UserSerializer(serializers.ModelSerializer):
  photo = ImageSerializer()
  country = CountrySerializer()

  class Meta:
    model = User
    exclude = (
      "login",
      "password", 
      "activation_key",  
      "is_staff",
      "is_legal",
      "groups",
      "user_permissions",
      "is_superuser",
      "last_login",
      "recovery_key",
      "smscode"
    )

class UserCheckerSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserChecker
    exclude = ['password']