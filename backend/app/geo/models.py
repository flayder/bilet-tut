from django.db import models

class Country(models.Model):
  name = models.CharField(verbose_name="Имя", blank=True, null=True, max_length=255)
  crt_date = models.DateField(verbose_name="Дата", auto_now=True)

  class Meta:
    verbose_name = "Страна"
    verbose_name_plural = "Страны"

  def __str__(self):
    return f"{self.name}"

class Region(models.Model):
  name = models.CharField(verbose_name="Имя", blank=True, null=True, max_length=255)
  geo_country = models.ForeignKey(Country, on_delete=models.CASCADE)
  crt_date = models.DateField(verbose_name="Дата", auto_now=True)

  class Meta:
    verbose_name = "Регион"
    verbose_name_plural = "Регионы"

  def __str__(self):
    return f"{self.name}"

class City(models.Model):
  name = models.CharField(verbose_name="Имя", blank=True, null=True, max_length=255)
  geo_region = models.ForeignKey(Region, verbose_name="Город", on_delete=models.CASCADE)
  crt_date = models.DateField(verbose_name="Дата", auto_now=True)

  class Meta:
    verbose_name = "Город"
    verbose_name_plural = "Города"

  def __str__(self):
    return f"{self.name}"
