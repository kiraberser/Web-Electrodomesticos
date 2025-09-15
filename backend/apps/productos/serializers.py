from rest_framework import serializers
from .models import Marca, Categoria, Refaccion, Proveedor
from apps.inventario.services import registrar_entrada_inicial_refaccion

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'pais_origen']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']

class RefaccionSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.SerializerMethodField(read_only=True)
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Refaccion
        fields = [
            'id', 'codigo_parte', 'nombre', 'descripcion', 
            'marca', 'marca_nombre', 'categoria', 'categoria_nombre',
            'precio', 'existencias', 'estado', 'compatibilidad',
            'fecha_ingreso', 'ultima_actualizacion', 'proveedor'
        ]

    def get_marca_nombre(self, obj):
        # Refaccion.marca es CharField; si luego se normaliza a FK, esto puede simplificarse
        try:
            return getattr(obj.marca, 'nombre', None) if not isinstance(obj.marca, str) else obj.marca
        except Exception:
            return None

    def create(self, validated_data):
        # Guardamos existencias iniciales para crear el movimiento ENTRADA
        cantidad_inicial = validated_data.get('existencias', 0)
        refaccion = super().create(validated_data)
        if cantidad_inicial and cantidad_inicial > 0:
            registrar_entrada_inicial_refaccion(refaccion, cantidad_inicial)
        return refaccion

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'contacto', 'telefono', 'correo_electronico', 'direccion']
