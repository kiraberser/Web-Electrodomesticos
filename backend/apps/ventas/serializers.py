from rest_framework import serializers
from .models import Ventas, VentasServicios

class VentasSerializer(serializers.ModelSerializer):
    refaccion_nombre = serializers.ReadOnlyField(source='refaccion.nombre')
    marca_nombre = serializers.ReadOnlyField(source='marca.nombre')
    
    class Meta:
        model = Ventas
        fields = ['id', 'refaccion_nombre', 'marca_nombre', 'cantidad', 'precio_unitario', 'total', 'fecha_venta']
        read_only_fields = ['precio_unitario', 'total']
        
class VentasServiciosSerializer(serializers.ModelSerializer):
    servicio_aparato = serializers.ReadOnlyField(source='servicio.aparato')
    
    class Meta:
        model = VentasServicios
        fields = ['id', 'servicio_aparato', 'precio_unitario', 'costo', 'total', 'fecha_venta']
        read_only_fields = ['precio_unitario', 'costo', 'total']