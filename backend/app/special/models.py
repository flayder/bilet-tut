from django.db import models
from app.events.models import *

class Special(models.Model):
  name = models.CharField("Название", max_length=255)
  genres = models.ManyToManyField(EventGenre, verbose_name="Жанры", blank=True, default=None)
  events = models.ManyToManyField(Events, verbose_name="Мероприятия", blank=True, default=None)
  description = models.TextField("Описание", blank=True, default=None, null=True)
  date = models.DateTimeField("Дата", auto_now_add=True)

  class Meta:
    verbose_name = "Спецпредложение"
    verbose_name_plural = "Спецпредложения"
    
  def __str__(self):
    return f"{self.name}"
