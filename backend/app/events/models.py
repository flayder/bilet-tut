from django.db import models
from django.contrib.gis.db.models import PointField
from app.users.models import User, UserChecker
from app.payment.models import Payment
from app.images.models import Image
from app.geo.models import City
from django.utils.timezone import now
import datetime

#Модель для статусов мероприятий
class EventStatus(models.Model):
  code = models.CharField("Код статуса мероприятия", max_length=255)
  name = models.CharField("Название статуса мероприятия", max_length=255)

  class Meta:
    verbose_name = "Статус мероприятия"
    verbose_name_plural = "Статусы мероприятия"


  def __str__(self):
    return f"{self.name}"


#Модель для типов мероприятий
class EventType(models.Model):
  code = models.CharField("Код типа мероприятия", max_length=255)
  name = models.CharField("Название типа мероприятия", max_length=255)

  class Meta:
    verbose_name = "Тип мероприятия"
    verbose_name_plural = "Тип мероприятия"


  def __str__(self):
    return f"{self.name}"
    

#Модель для жанров мероприятий
class EventGenre(models.Model):
  code = models.CharField("Код жанра мероприятия", blank=True, null=True, default=None, max_length=255)
  name = models.CharField("Название жанра мероприятия", max_length=255)

  class Meta:
    verbose_name = "Жанр мероприятия"
    verbose_name_plural = "Жанры мероприятия"

  def __str__(self):
    return f"{self.name}"


#Модель для возрастного ограничения мероприятий
class EventAge(models.Model):
  code = models.CharField("Код ограничение возраста мероприятия", max_length=255)
  name = models.CharField("Количество ограничение возраста мероприятия", max_length=255)

  class Meta:
    verbose_name = "Ограничение возраста мероприятия"
    verbose_name_plural = "Ограничения возраста мероприятия"
  
  def __str__(self):
    return f"{self.name}"


#Модель для мест площадок мероприятий
class EventAreaPlaces(models.Model):
  name = models.CharField("Место", max_length=255)
  row = models.CharField("Ряд", null=True, max_length=255)
  scheme = models.ManyToManyField('EventAreaSchems', blank=True, default=None, verbose_name="Схема")
  
  class Meta:
    verbose_name = "Стандартное место схемы"
    verbose_name_plural = "Стандартные места схем"
  
  def __str__(self):
    return f"{self.name}"


#Модель для схем плоащадок мероприятий
class EventAreaSchems(models.Model):
  name = models.CharField("Название схемы площадки", max_length=255)
  preview = models.ManyToManyField(Image, verbose_name="Превью схемы", default=None)
  schem = models.TextField("Схема сцены", null=True, blank=True)
  places = models.ManyToManyField(EventAreaPlaces, through=EventAreaPlaces.scheme.through, verbose_name="Места")
  dates = models.ManyToManyField('EventDate', verbose_name="Даты схемы", blank=True, default=None)
  categories = models.ManyToManyField('EventAreaCategory', verbose_name="Категории цен", blank=True, default=None)
  prices = models.ManyToManyField('EventPrice', verbose_name="Цены", blank=True, default=None)


  class Meta:
    verbose_name = "Cхема зала"
    verbose_name_plural = "Схемы зала"

  def __str__(self):
    return f"{self.name}"


#Модель для категорий цен мероприятий
class EventAreaCategory(models.Model):
  evented = models.BooleanField("Принадлежит к мероприятию", default=False)
  active = models.BooleanField(verbose_name="Активность", default=True)
  name = models.CharField("Название", max_length=255)
  description = models.TextField("Описание", default='')
  color = models.CharField("Цвет", max_length=255)
  price = models.IntegerField("Цена")
  user = models.ForeignKey(User, verbose_name="Пользователь", blank=True, null=True, default=None, on_delete=models.PROTECT)
  count = models.IntegerField("Количество билетов", null=True, default=None)
  scheme = models.ManyToManyField(EventAreaSchems, through=EventAreaSchems.categories.through, verbose_name="Схема", blank=True, default=None)
  event = models.ManyToManyField('Events', verbose_name="Мероприятия", blank=True)
  is_deleted = models.BooleanField("Удален пользователем", default=False)
  
  class Meta:
    verbose_name = "Категория цен"
    verbose_name_plural = "Категории цен"
  
  def __str__(self):
    return f"{self.name} - {self.price} {self.user}"


#Модель для цен мероприятий
class EventPrice(models.Model):
  #evented = models.BooleanField("Принадлежит к мероприятию", default=False)
  price = models.IntegerField("Цена")
  color = models.CharField("Цвет", max_length=20)
  raising = models.IntegerField(verbose_name="Повысить после n продаж", default=0, blank=True, null=True)
  date_to = models.DateField(verbose_name="По дате", blank=True, null=True)
  user = models.ForeignKey(User, verbose_name="Пользователь", blank=True, null=True, default=None, on_delete=models.PROTECT)
  place = models.ManyToManyField(EventAreaPlaces, verbose_name="Место", blank=True, default=None)
  up_price = models.BooleanField("Повысить цену после", default=False)
  event = models.ManyToManyField('Events', verbose_name="Мероприятия", blank=True)
  schemes = models.ManyToManyField(EventAreaSchems, through=EventAreaSchems.prices.through, verbose_name="Схемы", blank=True, default=None)
  is_deleted = models.BooleanField("Удален пользователем", default=False)
  

  class Meta:
    verbose_name = "Цена мероприятия"
    verbose_name_plural = "Цены мероприятия"

  def get_user(self):
    user = self.user
    if not user:
      return None
    return user

  def __str__(self):
    return f"{self.price} - {self.user}"


#Модель для площадок мероприятий
class EventArea(models.Model):
  is_scheme = models.BooleanField("Схема", default=True)
  code = models.CharField("Код площадки мероприятия", max_length=255)
  name = models.CharField("Количество площадки мероприятия", max_length=255)
  city = models.ForeignKey(City, verbose_name="Город", default=None, null=True, on_delete=models.PROTECT)
  address = models.CharField("Адрес площадки", default=None, null=True, max_length=255)
  gallery = models.ManyToManyField(Image, verbose_name="Галерея", default=None)
  location = PointField(geography=True, srid=4326, default=None, null=True, blank=True)
  schems = models.ManyToManyField(EventAreaSchems, blank=True, default=None, verbose_name="Схемы зала")

  class Meta:
    verbose_name = "Площадка мероприятия"
    verbose_name_plural = "Площадки мероприятия"

  def __str__(self):
    return f"{self.name}"


#Модель для дат мероприятий
class EventDate(models.Model):
  start_date = models.DateTimeField(verbose_name="Дата проведения", editable=True)
  finish_date = models.DateTimeField(verbose_name="Дата закрытия продаж", editable=True)
  event = models.ManyToManyField('Events', verbose_name="Мероприятия", blank=True)
  schemes = models.ManyToManyField(EventAreaSchems, through=EventAreaSchems.dates.through, verbose_name="Схемы", blank=True)
  user = models.ForeignKey(User, verbose_name="Пользователь", default=None, null=True, blank=True, on_delete=models.PROTECT)
  is_deleted = models.BooleanField("Удален пользователем", default=False)

  class Meta:
    verbose_name = "Дата мероприятия"
    verbose_name_plural = "Дата мероприятия"

  def __str__(self):
    return f"{self.start_date} - {self.finish_date}"
  
  def format(self, value, format):
    return datetime.datetime.strftime(self[value], format)


#Модель для шаблонов для печати мероприятий
class EventMailTemplate(models.Model):
  image = models.ForeignKey(Image, verbose_name="Картинка шаблона", null=True, blank=True, default=None, on_delete=models.PROTECT)
  attention = models.TextField("Блок внимание", blank=True, null=True, default=None)
  is_attention = models.BooleanField("Блок внимание по стандарту", default=False)
  returning = models.TextField("Блок правила возврата", blank=True, null=True, default=None)
  is_returning = models.BooleanField("Блок правила возврата по стандарту", default=False)
  description = models.TextField("Блок о событии", blank=True, null=True, default=None)
  is_description = models.BooleanField("Блок о событии по стандарту", default=False)
  user = models.ForeignKey(User, verbose_name="Пользователь", default=None, null=True, blank=True, on_delete=models.PROTECT)
  event = models.ForeignKey('Events', verbose_name="Мероприятие", default=None, null=True, blank=True, on_delete=models.CASCADE)


  class Meta:
    verbose_name = "Шаблоны для печати"
    verbose_name_plural = "Шаблон для печати"

  def __str__(self):
    text = ''
    if self.attention:
      text = self.attention
    
    elif self.returning:
      text = self.returning

    elif self.description:
      text = self.description

    if not text:
      text = f"Шаблон №{self.pk}"

    return f"{text}"


#Модель для мероприятий
class Events(models.Model):
  user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT)
  name = models.CharField("Название мероприятия", max_length=255)
  is_main_slider = models.BooleanField(verbose_name="Выводить в слайдере на главной", default=False)
  is_active = models.BooleanField(verbose_name="Активность", default=False)
  is_expected = models.BooleanField(verbose_name="Ожидаемый", default=False)
  for_child = models.BooleanField(verbose_name="Для детей", default=False)
  area = models.ForeignKey(EventArea, verbose_name="Площадка", null=True, default=None, on_delete=models.PROTECT)
  type = models.ForeignKey(EventType, verbose_name="Тип", default=None, blank=True, null=True, on_delete=models.PROTECT)
  status = models.ForeignKey(EventStatus, verbose_name="Статус", on_delete=models.PROTECT)
  genre = models.ManyToManyField(EventGenre, verbose_name="Жанр", default=None, blank=True)
  age = models.ForeignKey(EventAge, verbose_name="Ограничение возраста", blank=True, null=True, default=None, related_name="age", on_delete=models.PROTECT)
  description = models.TextField("Описание", blank=True, null=True, default=None)
  prices = models.ManyToManyField(EventPrice, verbose_name="Цены", through=EventPrice.event.through, blank=True, default=None)
  dates = models.ManyToManyField(EventDate, verbose_name="Даты мероприятия", through=EventDate.event.through, blank=True, default=None)
  categories = models.ManyToManyField(EventAreaCategory, verbose_name="Категории", through=EventAreaCategory.event.through, blank=True, default=None)
  payment = models.ManyToManyField(Payment, verbose_name="Способ оплаты", blank=True, default=None)
  tax = models.IntegerField(verbose_name="Сервисный сбор", default=0)
  afisha = models.ForeignKey(Image, verbose_name="Афиша", related_name="afisha", null=True, blank=True, default=None, on_delete=models.CASCADE)
  preview = models.ForeignKey(Image, verbose_name="Анонс", related_name="preview", null=True, blank=True, default=None, on_delete=models.CASCADE)
  city = models.ForeignKey(City, verbose_name="Города", on_delete=models.PROTECT)
  stage_image = models.ManyToManyField(Image, verbose_name="Вид зала", blank=True, default=None)
  is_showcase = models.BooleanField(verbose_name="Рекламма на витрине сайта", default=False)
  created_at = models.DateTimeField(default=datetime.datetime.now)

  class Meta:
    verbose_name = "Мероприятие"
    verbose_name_plural = "Мероприятия"

  def __str__(self):
    return f"{self.pk} {self.name}"


#Модель для избранного мероприятий
class EventFavorite(models.Model):
  user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT)
  event = models.ForeignKey(Events, verbose_name="Мероприятие", on_delete=models.PROTECT)

  class Meta:
    verbose_name = "Избранное товаров"
    verbose_name_plural = "Избранные товаров"


#Модель для типов мероприятий
class EventPromotion(models.Model):
  TYPE_LIST = (
    ('TEMPLATE', 'Шаблонная'),
    ('FIX', 'Фиксированная'),
    ('DYNAMIC', 'Динамическая')
  )

  TEMPLATE_LIST = (
    ('TWONE', '2+1'),
    ('THREEONE', '3+1')
  )

  name = models.CharField("Название промоакции", max_length=255)
  event = models.ForeignKey(Events, verbose_name="Мероприятия", null=True, on_delete=models.PROTECT)
  start_date = models.DateField(verbose_name="Начало действия", auto_now_add=False, null=False)    
  finish_date = models.DateField(verbose_name="Окончание действия", auto_now_add=False, null=False)
  type = models.CharField(verbose_name="Тип промоакций", default="TEMPLATE", choices=TYPE_LIST, max_length=255)
  fix_sum = models.CharField("Процент или сумма", null=True, blank=True, max_length=255)
  fix_count = models.IntegerField("Количество фиксированное", null=True, blank=True)
  dynamic_sum = models.CharField("Процент или сумма", null=True, blank=True, max_length=255)
  dynamic_count = models.IntegerField("Количество динамическое", null=True, blank=True)
  template = models.CharField(verbose_name="Тип шаблона", null=True, blank=True, choices=TEMPLATE_LIST, max_length=255)
  template_descr = models.CharField(verbose_name="Тип шаблона", null=True, blank=True, max_length=255)
  user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT)
  

  class Meta:
    verbose_name = "Промоакции"
    verbose_name_plural = "Промоакция"


  def __str__(self):
    return f"{self.name}"