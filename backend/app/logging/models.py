import os, uuid
from django.db import models
from app.users.models import User

class Logging(models.Model):
  action = models.CharField("Действия", max_length=255)
  user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT)
  date = models.DateTimeField("Дата", auto_now_add=True)

  class Meta:
    verbose_name = "Логирование"
    verbose_name_plural = "Логирование"
    
  def __str__(self):
    return f"{self.user}"