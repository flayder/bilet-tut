import os, uuid
from django.db import models
from django.db.models.signals import pre_save, pre_delete
from ordered_model.models import OrderedModel
from django.core.files.storage import default_storage
from django.utils.html import mark_safe
from django.conf import settings
from thumbnails.fields import ImageField
from django.core.files.images import get_image_dimensions


def file_cleanup(sender, **kwargs):
  try:
    inst = kwargs["instance"]
    path = inst.image.path
    default_storage.delete(path)
  except Exception as err:
    print('err', err)


def get_realestate_photo_filename(instance, filename):
  filename, ext = os.path.splitext(filename)
  filename = '%s%s' % (uuid.uuid4(), ext)

  return os.path.join('photos', filename[:2], filename[2:4], filename)

class Image(OrderedModel):
  THUMBNAILS_DIMENSIONS = (
    ('150x150', {'crop': u'center'}),
    ('720x540', {'crop': u'center'}),
    ('1920x1080', {'upscale': False}),
  )

  # id = models.AutoField(primary_key=True)
  image = ImageField(pregenerated_sizes=["small", "large", "medium"], upload_to=get_realestate_photo_filename, max_length=255, width_field='width', height_field='height')
  width = models.IntegerField(default=0, editable=False)
  height = models.IntegerField(default=0, editable=False)
  is_main = models.BooleanField(default=False)
  is_deleted = models.BooleanField(default=False)

  external_url = models.URLField("Внешняя ссылка", max_length=255, blank=True, null=True)

  class Meta:
    verbose_name = "Изображение"
    verbose_name_plural = "Изображения"

  def image_tag(self):
    if self.image:
      return mark_safe('<img src=\'%s/assets/img/%s\' width=\'150\' height=\'auto\' />' % (settings.LOCAL_URL, self.image))
    return ''
    
  def __str__(self):
    return f"{self.image}"


pre_delete.connect(file_cleanup, sender=Image)

def FileUploader(file, is_main = False):
  try:
    if file:
      width, height = get_image_dimensions(file)
      if width and height:
        return Image.objects.create(image=file, width=width, height=height, is_main=is_main)
  except Exception as file:
    print('file', file)
    pass

  return False

class FileOrImage(OrderedModel):
  THUMBNAILS_DIMENSIONS = (
    ('150x150', {'crop': u'center'}),
    ('720x540', {'crop': u'center'}),
    ('1920x1080', {'upscale': False}),
  )

  # id = models.AutoField(primary_key=True)
  image = ImageField(pregenerated_sizes=["small", "large", "medium"], upload_to=get_realestate_photo_filename, max_length=255, width_field='width', height_field='height')
  width = models.IntegerField(default=0, editable=False)
  height = models.IntegerField(default=0, editable=False)
  is_main = models.BooleanField(default=False)
  is_deleted = models.BooleanField(default=False)

  external_url = models.URLField("Внешняя ссылка", max_length=255, blank=True, null=True)

  class Meta:
    verbose_name = "Изображение"
    verbose_name_plural = "Изображения"

  def image_tag(self):
    if self.image:
      return mark_safe('<img src=\'%s/assets/img/%s\' width=\'150\' height=\'auto\' />' % (settings.LOCAL_URL, self.image))
    return ''
    
  def __str__(self):
    return f"{self.image}"


pre_delete.connect(file_cleanup, sender=FileOrImage)

def FileOrImageUploader(file, is_main = False):
  try:
    if file:
      width, height = get_image_dimensions(file)
      if width and height:
        return FileOrImage.objects.create(image=file, width=width, height=height, is_main=is_main)
  except Exception as file:
    print('FileOrImage', file)
    pass

  return False