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
        fields = [
            'id', 'servicio', 'servicio_aparato',
            'mano_obra', 'refacciones_total', 'total',
            'fecha_venta', 'observaciones', 'tecnico', 'garantia_dias', 'estado_pago'
        ]
        read_only_fields = ['fecha_venta', 'total']

    def validate(self, attrs):
        mano_obra = attrs.get('mano_obra', 0)
        refacciones_total = attrs.get('refacciones_total', 0)
        attrs['total'] = (mano_obra or 0) + (refacciones_total or 0)
        return attrs