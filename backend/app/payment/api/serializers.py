from rest_framework import serializers
from django.conf import settings
from app.payment.models import *
from app.images.api.serializers import *

class PaymentSerializer(serializers.ModelSerializer):
    logo = ImageSerializer()
    
    class Meta:
        model = Payment
        fields = '__all__'