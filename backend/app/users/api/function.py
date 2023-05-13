import hashlib, random, string
from django.contrib.auth.hashers import make_password
from app.users.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from app.users.api.serializers import RegisterSerializer
from rest_framework.authtoken.models import Token

#Функция для создания нового пользователя
def CreateOrUpdateSocialUser(request, login, password):
  user = authenticate(request=request,
                        login=login, password=password)
  if not user:
    check = User.objects.filter(login=login).count()
    if check == 0:
      serializer = RegisterSerializer(data={'login': login, 'password': password, 'confirmPassword': password})
      serializer.is_valid(raise_exception=True)
      user = User.objects.create(login=login, password=make_password(password))
    else:
      return Response({
        'results': 'Неверные данные атворизации'
      }, 400)
    
  if user:
    token, created = Token.objects.update_or_create(user=user)

    return token
  
  return Response({
    'results': 'Неверные данные атворизации'
  }, 400)

def generate_key(unique: str):
  return hashlib.md5(str(str(unique) + str(random.random())).encode('utf-8')).hexdigest()

def make_pass(user: User, password: str):
  user.set_password(password)
  user.save()

def generate_pass():
  letters = string.ascii_lowercase

  return ''.join(random.choice(letters) for i in range(10)) 