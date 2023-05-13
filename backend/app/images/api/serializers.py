from rest_framework import serializers
from django.conf import settings
from app.images.models import *
from thumbnails.models import ThumbnailMeta

class ThubnailRelated(serializers.RelatedField):
    def to_representation(self, value):
        thumbnails = value.thumbnails
        small = None
        try:
            small = f'{settings.LOCAL_URL}/assets{thumbnails.small.url}'
        except Exception:
            pass

        medium = None
        try:
            medium = f'{settings.LOCAL_URL}/assets{thumbnails.medium.url}' 
        except Exception:
            pass

        large = None
        try:
            large = f'{settings.LOCAL_URL}/assets{thumbnails.large.url}' 
        except Exception:
            pass

        return {
            'url': f'{settings.LOCAL_URL}/assets{settings.MEDIA_URL}{value}',
            'small':  small,
            'medium':  medium,
            'large': large
        }

class ImageSerializer(serializers.ModelSerializer):
    image = ThubnailRelated(queryset=Image.objects.all())
    class Meta:
        model = Image
        fields = '__all__'

class FileOrImageSerializer(serializers.ModelSerializer):
    image = ThubnailRelated(queryset=FileOrImage.objects.all())
    class Meta:
        model = FileOrImage
        fields = '__all__'