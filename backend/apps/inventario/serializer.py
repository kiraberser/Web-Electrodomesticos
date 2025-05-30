from .models import Inventario

class InventarioSerializer(serializers.ModelSerializer):
    refaccion_nombre = serializers.ReadOnlyField(source='refaccion.nombre')
    proveedor_nombre = serializers.ReadOnlyField(source='proveedor.nombre', allow_null=True)

    class Meta:
        model = Inventario
        fields = [
            'id', 'refaccion', 'refaccion_nombre', 
            'proveedor', 'proveedor_nombre',
            'cantidad', 'tipo_movimiento', 
            'fecha', 'observaciones'
        ]