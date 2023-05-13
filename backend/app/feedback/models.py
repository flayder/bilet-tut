from django.db import models

class Questions(models.Model):
  code = models.CharField("Код вопроса", max_length=255)
  name = models.CharField("Название вопроса", max_length=255)

  class Meta:
    verbose_name = "Категория вопросов"
    verbose_name_plural = "Категории вопросов"

  def __str__(self):
    return f"{self.name}"

class Feedback(models.Model):
  question = models.ForeignKey(Questions, verbose_name="Категория вопросов", on_delete=models.PROTECT)
  theme = models.CharField("Тема вопроса", max_length=255)
  text = models.TextField("Описание")
  order = models.CharField("Номер заказа", max_length=255)
  event_name = models.CharField("Название мероприятия", max_length=255)
  name = models.CharField("Имя", max_length=255)
  email = models.CharField("Почта", max_length=255)
  date = models.DateField("Дата", auto_now_add=True)
  

  class Meta:
    verbose_name = "Форма обратной связи"
    verbose_name_plural = "Формы обратной связи"


  def __str__(self):
    return f"{self.theme}"
