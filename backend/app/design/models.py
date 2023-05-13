import os, uuid
from django.db import models
from app.images.models import Image
from app.events.models import *

class Slider(models.Model):
  name = models.CharField("Название", max_length=255)
  position = models.IntegerField("Позиция", default=1)
  is_banner = models.BooleanField("Баннер", default=False)
  title = models.CharField("Заголовок", max_length=255)
  subtitle = models.CharField("Подзаголовок", max_length=255)
  link = models.CharField("Ссылка", max_length=255)
  date = models.DateField("Дата")
  image = models.ForeignKey(Image, default=None, null=True, verbose_name="Изображение", on_delete=models.PROTECT)
  event = models.ForeignKey(Events, default=None, null=True, verbose_name="Мероприятие", on_delete=models.PROTECT)
  type = models.ForeignKey(EventType, default=None, null=True, verbose_name="Тип мероприятия", on_delete=models.PROTECT)
  

  class Meta:
    verbose_name = "Слайдер"
    verbose_name_plural = "Слайдеры"
    
  def __str__(self):
    return f"{self.name}"


class Rubric(models.Model):
  name = models.CharField("Название", max_length=255)
  position = models.IntegerField("Позиция", default=1)
  events = models.ManyToManyField(Events, verbose_name="Мероприятия", default=None, blank=True)
  genres = models.ManyToManyField(EventGenre, verbose_name="Жанры", default=None, blank=True)
  date = models.DateField("Дата", auto_now_add=True)
  image = models.ForeignKey(Image, default=None, null=True, verbose_name="Изображение", on_delete=models.PROTECT)

  class Meta:
    verbose_name = "Рубрика"
    verbose_name_plural = "Рубрики"
    
  def __str__(self):
    return f"{self.name}"