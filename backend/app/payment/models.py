from django.db import models
from app.images.models import *
from app.users.models import *


class Payment(models.Model):
  code = models.CharField("Код", default="", max_length=255)
  name = models.CharField("Название", default="", max_length=255)
  logo = models.ForeignKey(Image, verbose_name="Логотип", default=None, null=True, on_delete=models.CASCADE)


  class Meta:
    verbose_name = "Способ оплаты"
    verbose_name_plural = "Способы оплаты"

  def __str__(self):
    return f"{self.name}"

