import binascii
import os
from django.utils.translation import gettext_lazy as _
from email.policy import default
from random import choices
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from app.images.models import Image
from app.geo.models import Country
from django.conf import settings
from django.db.models.signals import post_save
from utils.function import hash
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

#Генерация токена для API для созданного пользователя
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
  if created:
    Token.objects.create(user=instance)

# class Tax(models.Model):
#   pass

#Менеджер для пользователя
class UserManager(BaseUserManager):
  def create_user(self, login, password=None, **extra_fields):
    if not login:
      raise ValueError('У пользователей должен присутствовать login')

    user = self.model(login=login)
    user.set_password(password)
    user.save(using=self._db)

    return user

  def create_superuser(self, login, password, **extra_fields):
    user = self.create_user(login=login, password=password)
    user.is_staff = True
    user.is_superuser = True
    user.save(using=self._db)

    return user

  def get_by_natural_key(self, username):
    return self.get(**{'%s__iexact' % self.model.USERNAME_FIELD: username})

#Модель пользователей сайта
class User(AbstractBaseUser, PermissionsMixin):
  ROLE_ADMIN = 'admin'
  ROLE_VIEWER = 'viewer'
  ROLE_MANAGER = 'manager'

  ROLE_LIST = (
    (ROLE_ADMIN, "Админ"),
    (ROLE_VIEWER, "Зритель"),
    (ROLE_MANAGER, "Организатор"),
  )
  login = models.CharField(verbose_name="Логин", unique=True, max_length=255)
  email = models.EmailField(verbose_name="Email", unique=True, blank=True, null=True, max_length=255)
  phone = models.CharField(verbose_name="Телефон", unique=True, blank=True, null=True, max_length=25)
  photo = models.ForeignKey(Image, verbose_name="Фото", blank=True, null=True, on_delete=models.CASCADE)
  username = models.CharField(verbose_name="Имя", blank=True, null=True, max_length=255)
  surname = models.CharField(verbose_name="Фамилия", blank=True, null=True, max_length=255)
  lastname = models.CharField(verbose_name="Отчество", blank=True, null=True, max_length=255)
  birthday = models.DateField(verbose_name="Дата рождения", blank=True, null=True)
  role = models.CharField(verbose_name="Роль пользователя", default="viewer", choices=ROLE_LIST, max_length=255)
  #payment = models.ForeignKey(Payment, verbose_name="Фото", on_delete=models.CASCADE)

  date_joined = models.DateTimeField(auto_now_add=True)
  is_active = models.BooleanField(default=True, null=False)
  is_staff = models.BooleanField(default=False, null=False)
  is_legal = models.BooleanField(default=False, null=False)
  is_email_validated = models.BooleanField(default=False, null=False)
  abilet = models.BooleanField(default=True)

  activation_key = models.CharField(max_length=40, blank=True, null=True)
  
  country = models.ForeignKey(Country, verbose_name="Страна", blank=True, null=True, on_delete=models.CASCADE)
  organisation_name = models.CharField(verbose_name="Название организации", blank=True, null=True, max_length=255)
  legal_address = models.CharField(verbose_name="Юридический адрес", blank=True, null=True, max_length=255)
  ogrn = models.CharField(verbose_name="ОГРН", blank=True, null=True, max_length=255)
  inn = models.CharField(verbose_name="ИНН", blank=True, null=True, max_length=255)
  kpp = models.CharField(verbose_name="КПП", blank=True, null=True, max_length=255)
  tax = models.IntegerField(verbose_name="Комиссионный сбор", blank=True, null=True, default=0)
  nds = models.BooleanField(default=True, verbose_name="Включать в стоимость билетов НДС", null=False)
  bank_name = models.CharField(verbose_name="Название банка", blank=True, null=True, max_length=255)
  bik = models.CharField(verbose_name="Название банка", blank=True, null=True, max_length=255)
  bank_account = models.CharField(verbose_name="Расчетный счет", blank=True, null=True, max_length=255)
  kor_name = models.CharField(verbose_name="Корр. счет", blank=True, null=True, max_length=255)
  legal_first_name = models.CharField(verbose_name="Фамилия подписывающего лица", blank=True, null=True, max_length=255)
  legal_name = models.CharField(verbose_name="Имя подписывающего лица", blank=True, null=True, max_length=255)
  legal_last_name = models.CharField(verbose_name="Отчество подписывающего лица", blank=True, null=True, max_length=255)
  legal_role = models.CharField(verbose_name="Должность", blank=True, null=True, max_length=255)
  legal_state = models.CharField(verbose_name="Действующий на основании", blank=True, null=True, max_length=255)
  recovery_key = models.CharField(max_length=40, blank=True, null=True)
  smscode = models.CharField(max_length=40, blank=True, null=True)


  USERNAME_FIELD = 'login'

  objects = UserManager()

  class Meta:
    verbose_name = "Пользователь"
    verbose_name_plural = "Пользователи"

  def __str__(self):
    return f"{self.email} {self.phone}"
  
  def get_name_info(self):
    result = ''

    if self.surname or self.username or self.lastname:
      if self.surname:
        result += f"{self.surname} "
      
      if self.username:
        result += f"{self.username} "

      if self.lastname:
        result += f"{self.lastname} "

    elif self.legal_first_name or self.legal_name or self.legal_last_name:
      if self.legal_first_name:
        result += f"{self.legal_first_name} "
      
      if self.legal_name:
        result += f"{self.legal_name} "

      if self.legal_last_name:
        result += f"{self.legal_last_name} "

    return result


#Модель пользователей проверяющих билеты через мобильное приложение
class UserChecker(models.Model):
  login = models.CharField(verbose_name="Логин", unique=True, max_length=255)
  email = models.EmailField(verbose_name="Email", unique=True, blank=True, null=True, max_length=255)
  phone = models.CharField(verbose_name="Телефон", unique=True, blank=True, null=True, max_length=25)
  password = models.CharField(verbose_name="Пароль", blank=True, null=True, max_length=255)
  username = models.CharField(verbose_name="Имя", blank=True, null=True, max_length=255)
  surname = models.CharField(verbose_name="Фамилия", blank=True, null=True, max_length=255)
  lastname = models.CharField(verbose_name="Отчество", blank=True, null=True, max_length=255)
  user = models.ForeignKey(User, verbose_name="Пользователь", blank=True, null=True, on_delete=models.PROTECT)
  
  class Meta:
    verbose_name = "Проверяющий"
    verbose_name_plural = "Проверяющие"


  def __str__(self):
    return f"{self.email} {self.phone}"



class TokenCheckers(models.Model):
  key = models.CharField(_("Key"), max_length=40, primary_key=True)
  user = models.OneToOneField(
    UserChecker, related_name='auth_token',
    on_delete=models.CASCADE, verbose_name=_("User")
  )
  created = models.DateTimeField(_("Created"), auto_now_add=True)

  class Meta:
    verbose_name = "Токен проверяющего"
    verbose_name_plural = "Токены проверяющего"

  def save(self, *args, **kwargs):
    if not self.key:
      self.key = self.generate_key()
    return super().save(*args, **kwargs)

  @classmethod
  def generate_key(cls):
    return binascii.hexlify(os.urandom(20)).decode()

  def __str__(self):
    return self.key


@receiver(post_save, sender=UserChecker)
def create_auth_token(sender, instance=None, created=False, **kwargs):
  if created:
    TokenCheckers.objects.create(user=instance)

  if len(instance.password) < 50:
    UserChecker.objects.filter(pk=instance.pk).update(password=hash(instance.password))