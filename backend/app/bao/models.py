from django.db import models
import datetime, pdfkit, os
from app.events.models import *
from app.users.models import *
from app.payment.models import Payment
from datetime import date
from utils.function import hash
from utils.mail import mail
from app.special.models import Special
from django.db.models import Q

class Discount(models.Model):
  PERCENT = 'percent'
  CASH = 'cash'
  POINT_CHOICES = (
    (PERCENT, 'Процент'),
    (CASH, 'Точная сумма')
  )

  active = models.BooleanField(verbose_name="Активность", default=True)
  name = models.CharField(verbose_name="Название скидки", max_length=255)
  start_date = models.DateField(verbose_name="Начало действия", auto_now_add=False, null=False)    
  finish_date = models.DateField(verbose_name="Окончание действия", auto_now_add=False, null=False)
  count = models.IntegerField(verbose_name="Количество использований", null=True)
  value = models.IntegerField(verbose_name="Размер скидки")
  point = models.CharField(verbose_name="Тип скидки", choices=POINT_CHOICES, max_length=255)
  event = models.ForeignKey(Events, verbose_name="Мероприятия", blank=True, null=True, default=None, on_delete=models.PROTECT)
  user = models.ForeignKey(User, verbose_name="Пользователь", null=True, default=None, on_delete=models.PROTECT)
  is_deleted = models.BooleanField("Удален пользователем", default=False)

  class Meta:
    verbose_name = "Промокод"
    verbose_name_plural = "Промокоды"

  def __str__(self):
    return f"{self.name}"

  def is_active(self):
    return self.active

  def is_finish_date(self):
    if not self.finish_date:
      return True
    fd = self.finish_date
    date = datetime.datetime(fd.year, fd.month, fd.day)

    if date > datetime.datetime.now():
      return True

    return False


  def is_count(self):

    if self.count == 0:
      return True

    counts = Checkout.objects.filter(discount=self.pk).count()

    return counts < self.count

  def is_acceptable(self):
    if not self.is_active():
      return False

    if not self.is_finish_date():
      return False

    if not self.is_count():
      return False
    
    return True


  def set_discount(self, pricing: int):
    
    if self.active and self.value > 0:
      if self.point == "percent":
        dis = pricing * self.value / 100
        pr = pricing - dis

        if pr > 0:
          return pr

      else:
        pr = pricing - self.value

        if pr > 0:
          return pr

    return pricing

class CheckoutStatus(models.Model):
    code = models.CharField("Код", default="", max_length=255)
    name = models.CharField("Название", default="", max_length=255)
    
    class Meta:
      verbose_name = "Статус оплаты"
      verbose_name_plural = "Статусы оплаты"

    def __str__(self):
      return f"{self.name}"



class Basket(models.Model):
  product = models.ForeignKey(Events, verbose_name="Товар", on_delete=models.PROTECT)
  ordered = models.IntegerField("Товар принадлежит к заказу", default=0)
  quantity = models.IntegerField(verbose_name="Количество", default=1)
  user = models.ForeignKey(User, verbose_name="Пользователь", null=True, default=None, blank=True, on_delete=models.PROTECT)
  f_user = models.CharField(verbose_name="Идентификатор для незарегистрированных пользователей", null=True, default=None, blank=True, max_length=32)
  created_at = models.DateTimeField(verbose_name="Дата создания", default=datetime.datetime.now)
  price = models.ForeignKey(EventPrice, verbose_name="Цена", null=True, default=None, blank=True, on_delete=models.PROTECT)
  #pricing = models.IntegerField(verbose_name="Цена на момент добавления в корзину", default=0)
  discount_price = models.IntegerField(verbose_name="Размер скидки", default=0)
  category = models.ForeignKey(EventAreaCategory, verbose_name="Категория цен", null=True, default=None, blank=True, on_delete=models.PROTECT)
  date = models.ForeignKey(EventDate, verbose_name="Дата", null=True, default=None, blank=True, on_delete=models.PROTECT)
  place = models.ForeignKey(EventAreaPlaces, verbose_name="Место в зале", null=True, default=None, blank=True, on_delete=models.PROTECT)
  pricing = models.IntegerField("Цена", default=0)
  qr_code = models.CharField("Код qr", max_length=255, default=None, null=True, blank=True)

  class Meta:
    verbose_name = "Корзина"
    verbose_name_plural = "Корзины"

  def __str__(self):
    return f"{self.pk} Дата мероприятия {self.date} {self.product.name}"

  def is_available(self):
    if self.category:
      count = Checkout.objects.filter(products=self, products__date=self.date, products__category=self.category, status=2).count()

      return int(self.category.count) - count

    if self.price:
      count = Checkout.objects.filter(products=self, products__date=self.date, products__price=self.price, status=2).count()

      if count > 0:
        return 0

      return 1

    return 0

  def get_price(self):
    price = 0
    payment = self.product.payment.filter(code="free")

    if len(payment) == 0:

      if self.category and self.category.price > 0:
        price = self.category.price

      elif self.price and self.price.price > 0:
        price = self.price.price

    else:
      
      price = self.pricing

    return price

  def get_discount_price(self, discount: Discount):
    if discount.is_acceptable() and \
      self.product and discount.event and \
      self.product.pk == discount.event.pk:

      price = 0
      if self.pricing > 0:
        price = self.pricing

      else:
        price = self.get_price()

      if price > 0:
        pricing = discount.set_discount(price)

        if price != pricing:
          return pricing

    return 0
  
  def get_total_price(self):
    if self.discount_price > 0:
      return self.pricing - self.discount_price
    
    return self.pricing


@receiver(post_save, sender=Basket)
def create_qr_code(sender, instance=None, created=False, **kwargs):
  if created:
    qr = f"{instance.pk} {datetime.datetime.now()}"
    Basket.objects.filter(pk=instance.pk).update(qr_code=hash(qr))


class Checkout(models.Model):
  discount = models.ForeignKey(Discount, verbose_name="Скидка", null=True, default=None, blank=True, on_delete=models.PROTECT)
  products = models.ManyToManyField(Basket)
  payment = models.ForeignKey(Payment, verbose_name="Способ оплаты", on_delete=models.PROTECT)
  status = models.ForeignKey(CheckoutStatus, verbose_name="Статус оплаты", on_delete=models.PROTECT)
  user = models.ForeignKey(User, verbose_name="Пользователь", null=True, default=None, on_delete=models.PROTECT)
  discount_type = models.CharField(verbose_name="Тип скидки указанный пользователя", null=True, blank=True, max_length=255, default=None)
  discount_value = models.IntegerField(verbose_name="Скидка указанная пользователем", default=0)
  discount_price = models.IntegerField(verbose_name="Стоимость заказа со скидкой", default=0)
  created_at = models.DateTimeField(verbose_name="Дата создания", default=datetime.date.today)
  total_price = models.IntegerField(verbose_name="Стоимость заказа без скидки", default=0)
  tax = models.IntegerField(verbose_name="Налог пользователя", default=0)
  bank_field = models.CharField(verbose_name="Заметка банка", null=True, blank=True, max_length=255, default=None)
  
  class Meta:
    verbose_name = "Заказ"
    verbose_name_plural = "Заказы"

  def __str__(self):
    return f"{self.user}"

  def get_total_price(self):
    prices = self.products.all()
    price = 0

    for pr in prices:
      try:
        price += int(pr.price)
      except Exception:
        pass

  
    return price

  def get_total_price_with_discount(self):
    prices = self.products.all()
    price = 0

    for pr in prices:
      try:
        price += int(pr.price)
      except Exception:
        pass

  def send_bilets(self):

    media = f"{settings.MEDIA_ROOT}/bilets/"

    email = self.user.email

    if email:
      pdfs = []
      products = self.products.all()
      for product in products:

        if product.product and product.user:
          pdf = f"{self.pk}_{product.pk}_{product.product.pk}_{product.user.pk}.pdf"

          if not os.path.exists(f"{media}{pdf}"):
            options = {
              'page-size': 'Letter',
              'encoding': "UTF-8",
              'no-outline': None
            }
            #print(f"{settings.BACKEND_URL}bilet/pdf/?order_id={self.pk}&basket_id={product.pk}")
            pdfkit.from_url(f"{settings.BACKEND_URL}bilet/pdf/?order_id={self.pk}&basket_id={product.pk}", f"{media}{pdf}", options=options)

          pdfs.append(f"{media}{pdf}")

      if len(pdfs) > 0:
        user = User.objects.get(pk=self.user.pk)

        mail(recepients=[user], subject=f"Новый заказ на сайте: {settings.LOCAL_URL}", \
            message=f"Заказ №{self.pk} был успешно оформлен", attachments=pdfs)

      
      genres = []
      prods = []

      for product in products:

        if not product.product in prods:
          prods.append(product.product)

        for genre in product.product.genre.distinct():
          if not genre in genres:
            genres.append(genre)

      specials = []

      if len(genres) > 0 and len(prods) > 0:
        specials = Special.objects.filter(
          (Q(genres__in=genres) & Q(events__in=prods)) |
          (Q(genres__in=genres) & Q(events=None)) |
          (Q(genres=None) & Q(events__in=prods))
          ).distinct()
      elif len(genres) > 0 and len(prods) == 0:
        specials = Special.objects.filter(genres__in=genres, events=None).distinct()
      
      elif len(prods) > 0 and len(genres) == 0:
        specials = Special.objects.filter(genres=None, events__in=prods).distinct()

      
      if len(specials) > 0:
        for special in specials:
          mail(recepients=[user], subject=special.name, \
            message=special.description)



class CheckoutReturnStatus(models.Model):
    code = models.CharField("Код", default="", max_length=255)
    name = models.CharField("Название", default="", max_length=255)

    class Meta:
        verbose_name = "Статус возврата"
        verbose_name_plural = "Статусы возврата"

    def __str__(self):
        return f"{self.name}"


class CheckoutReturnReason(models.Model):
    code = models.CharField("Код", default="", max_length=255)
    name = models.CharField("Название", default="", max_length=255)

    class Meta:
        verbose_name = "Причина возврата"
        verbose_name_plural = "Причины возврата"

    def __str__(self):
        return f"{self.name}"


class CheckoutReturn(models.Model):
    checkout = models.ForeignKey(Checkout, verbose_name="Заказ", on_delete=models.PROTECT)
    reason = models.ForeignKey(CheckoutReturnReason, verbose_name="Причина", on_delete=models.PROTECT)
    status = models.ForeignKey(CheckoutReturnStatus, verbose_name="Статус", on_delete=models.PROTECT)
    description = models.TextField("Описание")
    name = models.CharField("Фамилия Имя Отчество", null=True, default="", max_length=255)
    seria_passport = models.CharField("Серия паспорта", null=True, default="", max_length=255)
    number_passport = models.CharField("Номер паспорта", null=True, default="", max_length=255)
    date_passport = models.DateField("Дата выдачи", null=True, default="", max_length=255)
    given_passport = models.CharField("Кем выдан", null=True, default="", max_length=255)
    inn_bank = models.CharField("ИНН", null=True, default="", max_length=255)
    bik_bank = models.CharField("БИК", null=True, default="", max_length=255)
    receipt_bank = models.CharField("Расчетный счет", null=True, default="", max_length=255)
    korr_bank = models.CharField("Корр. счет", null=True, default="", max_length=255)
    user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT)
    date = models.DateField('Дата добавления', default=date.today)

    class Meta:
        verbose_name = "Запрос на возврат средств"
        verbose_name_plural = "Запросы на возврат средств"

    def __str__(self):
        return f"{self.user}"


class EventCheckinStatus(models.Model):
  code = models.CharField("Код статуса", max_length=255)
  name = models.CharField("Название статуса", max_length=255)

  class Meta:
    verbose_name = "Статус чекина"
    verbose_name_plural = "Статусы чекина"

  def __str__(self):
    return f"{self.name}"

class EventCheckin(models.Model):
  checkout = models.ForeignKey(Checkout, verbose_name="Заказ", default=None, null=True, blank=True, on_delete=models.PROTECT)
  product = models.ForeignKey(Basket, verbose_name="Товар", default=None, null=True, blank=True, on_delete=models.PROTECT)
  checker = models.ForeignKey(UserChecker, verbose_name="Проверяющий", on_delete=models.PROTECT)
  status = models.ForeignKey(EventCheckinStatus, verbose_name="Статус", on_delete=models.PROTECT)
  date = models.DateTimeField(default=now)


  class Meta:
    verbose_name = "Чекин"
    verbose_name_plural = "Чекины"

  def __str__(self):
    return f"{self.checkout} {self.checker}"