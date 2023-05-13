from django.db import models
from app.events.models import *
from app.images.models import *
from app.users.models import *

class Mailing(models.Model):
    CHOICES = (
        ("sms", "СМС"),
        ("email", "Почта")
    )

    date = models.DateTimeField("Дата запуска", auto_now=None, default=None)
    event = models.ManyToManyField(Events, verbose_name="Пользователь", default=None, blank=True)
    type = models.CharField("Тип рассылки", max_length=255, choices=CHOICES)
    toeveryone = models.BooleanField("Разослать всем пользователям", default=False)
    files = models.ManyToManyField(FileOrImage, default=None, blank=True)
    user_list = models.ManyToManyField(User, default=None, blank=True, related_name="user_list")
    user = models.ForeignKey(User, verbose_name="Пользователь", default=None, null=True, related_name="user", on_delete=models.PROTECT)
    text = models.TextField("Текст сообщения", blank=True, null=True, default=None)

    class Meta:
        verbose_name = "Рассылка"
        verbose_name_plural = "Рассылки"

    def __str__(self):
        return f"{self.event.all()[0]} {self.user}"