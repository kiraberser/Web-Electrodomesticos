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

        fields = 'aparato', 'cliente', 'costo', 'precio', 'fecha_reparacion', 'servicio'
        read_only_fields = ('fecha_reparacion', 'aparato', 'cliente')
    def validate_servicio(self, servicio):
        if servicio.estado != 'Entregado':
            raise serializers.ValidationError("El servicio debe estar en estado 'Entregado' para ser reparado.")
        if ServicioReparado.objects.filter(servicio=servicio).exists():
            raise serializers.ValidationError("Este servicio ya fue registrado como reparado.")
        return servicio
        
