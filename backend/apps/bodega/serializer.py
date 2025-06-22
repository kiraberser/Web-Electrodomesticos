from .models import Bodega
from rest_framework import serializers

class BodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bodega
        fields = '__all__'
        
        
        