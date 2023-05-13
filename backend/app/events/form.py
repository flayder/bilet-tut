from datetime import tzinfo
from tinymce.widgets import TinyMCE
from pytz import timezone
from .models import *
from django import forms
from mapwidgets.widgets import GooglePointFieldInlineWidget
from app.images.models import Image
from django.contrib.gis.geos import Point


class ModelChoiceField(forms.ModelChoiceField):
    def prepare_value(self, value):
        return super().prepare_value(value)

    def label_from_instance(self, obj):
        return obj.image_tag


class EventAreaSchemsForm(forms.ModelForm):
  class Meta:
    model = EventAreaSchems
    widgets = {
      'schem': TinyMCE(),
    }
    fields = '__all__'


class EventAreaForm(forms.ModelForm):
    # gallery = forms.ModelMultipleChoiceField(queryset=Image.objects.all())
    latitude = forms.FloatField(
        min_value=-5,
        max_value=180,
        required=False,
    )
    longitude = forms.FloatField(
        min_value=-5,
        max_value=180,
        required=False,
    )
    
    class Meta:
        model = Events
        fields = ('__all__')
        widgets = {
            'location': forms.HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        coordinates = self.initial.get('location', None)
        if isinstance(coordinates, Point):
            self.initial['longitude'], self.initial['latitude'] = coordinates.tuple
    
    def clean(self):
        data = super().clean()
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        if latitude and longitude:
            data['location'] = Point(longitude, latitude)
        
        #print('data', data)

        return data


class EventForm(forms.ModelForm):
    start_date = forms.DateTimeField()
    # afisha = ModelChoiceField(
    #     queryset=Events.objects.all(),
    #     to_field_name="pk",
    #     widget=autocomplete.ModelSelect2(
    #         url='image-autocomplete', 
    #         attrs={'data-html': True}
    #     )
    # )
    # preview = forms.ModelChoiceField(
    #     queryset=Events.objects.all(),
    #     widget=autocomplete.ModelSelect2(
    #         url='image-autocomplete', 
    #         attrs={'data-html': True}
    #     )
    # )
    # stage_image = forms.ModelChoiceField(
    #     queryset=Events.objects.all(),
    #     widget=autocomplete.ModelSelect2(
    #         url='image-autocomplete', 
    #         attrs={'data-html': True}
    #     )
    # )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['afisha'].initial = kwargs['instance'].afisha
        return None

        

    class Meta:
        model = Events
        fields = ('__all__')
