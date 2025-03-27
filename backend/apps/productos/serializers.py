from rest_framework import serializers
from .models import Marca, Categoria, Refaccion, Proveedor, Inventario

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'pais_origen']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']

class RefaccionSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.ReadOnlyField(source='marca.nombre')
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Refaccion
        fields = [
            'id', 'codigo_parte', 'nombre', 'descripcion', 
            'marca', 'marca_nombre', 'categoria', 'categoria_nombre',
            'precio', 'existencias', 'estado', 'compatibilidad',
            'fecha_ingreso', 'ultima_actualizacion'
        ]

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'contacto', 'telefono', 'correo_electronico', 'direccion']

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