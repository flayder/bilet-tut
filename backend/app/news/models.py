from tinymce.models import HTMLField
from django.db import models
from app.users.models import User
from app.images.models import Image

class News(models.Model):
  image = models.ForeignKey(Image, verbose_name="Обложка", null=True, blank=None, default=None, on_delete=models.PROTECT)
  title = models.CharField("Заголовок", max_length=255)
  subtitle = models.CharField("Подзаголовок", null=True, default=None, blank=True, max_length=255)
  content = HTMLField("Контент", blank=True, null=True)
  user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT)
  date = models.DateTimeField("Дата", auto_now_add=True)

  class Meta:
    verbose_name = "Новость"
    verbose_name_plural = "Новости"
    
  def __str__(self):
    return f"{self.title}"