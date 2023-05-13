from django.shortcuts import render
from django.conf import settings

from django.utils.html import format_html
from dal import autocomplete
from .models import Image

class ImageAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):

        qs = Image.objects.all()

        return qs
    def get_result_label(self, result):
        return format_html('<img src="{}/assets/img/{}" width="100%" height="auto">', settings.LOCAL_URL, result.image)
