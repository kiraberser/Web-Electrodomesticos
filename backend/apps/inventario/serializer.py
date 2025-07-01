from rest_framework import serializers

from .models import Inventario


class InventarioSerializer(serializers.ModelSerializer):
    refaccion_nombre = serializers.ReadOnlyField(source='refaccion.nombre')
    marca = serializers.ReadOnlyField(source='marca.nombre')
    categoria = serializers.ReadOnlyField(source='categoria.nombre')
    
    class Meta:
        model = Inventario
        fields = ['id', 'refaccion_nombre', 'cantidad', 'precio_unitario', 'marca', 'categoria']
        read_only_fields = ['precio_unitario']
