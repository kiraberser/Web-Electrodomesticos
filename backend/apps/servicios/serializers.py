from rest_framework import serializers
from .models import Servicio, ServicioReparado

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class ServicioReparadoSerializer(serializers.ModelSerializer):
    aparato = serializers.CharField(source='servicio.aparato', read_only=True)
    cliente = serializers.CharField(source='servicio.cliente', read_only=True)

    class Meta:
        model = ServicioReparado
        fields = ['id', 'servicio', 'cliente', 'aparato', 'costo', 'precio', 'fecha_entrega']