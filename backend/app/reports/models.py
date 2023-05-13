from unicodedata import category
from django.db import models
from django.contrib.gis.db.models import PointField
from app.users.models import User
from app.geo.models import City

class ReportPeriod(models.Model):
  code = models.CharField("Код периода отчета", max_length=255)
  name = models.CharField("Название периода отчета", max_length=255)
  period = models.IntegerField("Период времени в минутах", default=1)

  class Meta:
    verbose_name = "Период отчета"
    verbose_name_plural = "Периоды отчета"


  def __str__(self):
    return f"{self.name}"

class ReportType(models.Model):
  code = models.CharField("Код вида отчета", max_length=255)
  name = models.CharField("Название вида отчета", max_length=255)

  class Meta:
    verbose_name = "Вид отчета"
    verbose_name_plural = "Виды отчета"

  def __str__(self):
    return f"{self.name}"

class Reports(models.Model):
  active = models.BooleanField("Активность", default=False)
  date = models.DateField("Дата", auto_now_add=True)
  type = models.ForeignKey(ReportType, verbose_name="Вид отчета", null=True, default=True, on_delete=models.PROTECT)
  period = models.ForeignKey(ReportPeriod, verbose_name="Периоды отчета", null=True, default=True, on_delete=models.PROTECT)
  user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT)

  class Meta:
    verbose_name = "Отчет"
    verbose_name_plural = "Отчеты"


  def __str__(self):
    return f"{self.user} {self.date}"


