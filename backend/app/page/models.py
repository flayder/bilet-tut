from django.db import models
from tinymce.models import HTMLField

class ElementPage(models.Model):
  field = models.CharField("Поле для ввода", blank=True, null=True, max_length=255)
  html_field = HTMLField("HTML поле для ввода", blank=True, null=True)

  class Meta:
    verbose_name = "Элемент страницы"
    verbose_name_plural = "Элементы страницы"

  def __str__(self):
    return f"{self.field}"

class Page(models.Model):
  code = models.CharField("Код страницы", default='', max_length=255)
  h1 = models.CharField("Заголовок h1", max_length=255)
  content = HTMLField("Контент", null=True)
  seo_title = models.CharField("Сео заголовок", blank=True, null=True, max_length=255)
  seo_description = models.CharField("Сео описание", blank=True, null=True, max_length=255)
  date = models.DateField("Дата", auto_now_add=True)
  elements = models.ManyToManyField(ElementPage, verbose_name="Элементы страницы", blank=True)


  class Meta:
    verbose_name = "Статическая страница"
    verbose_name_plural = "Статические страницы"


  def __str__(self):
    return f"{self.h1}"
