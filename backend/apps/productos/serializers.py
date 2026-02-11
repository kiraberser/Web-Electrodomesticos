from rest_framework import serializers
from .models import Marca, Categoria, Refaccion, Proveedor, ComentarioProducto
from apps.inventario.services import registrar_entrada_inicial_refaccion

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'pais_origen', 'logo']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'imagen']

class RefaccionSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.SerializerMethodField(read_only=True)
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Refaccion
        fields = [
            'id', 'codigo_parte', 'nombre', 'descripcion', 
            'marca', 'marca_nombre', 'categoria', 'categoria_nombre',
            'precio', 'existencias', 'estado', 'compatibilidad', 'ubicacion_estante',
            'fecha_ingreso', 'ultima_actualizacion', 'proveedor', 'imagen'
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
        fields = ['id', 'nombre', 'contacto', 'telefono', 'correo_electronico', 'direccion', 'logo']


class ComentarioProductoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')
    usuario_email = serializers.ReadOnlyField(source='usuario.email')

    class Meta:
        model = ComentarioProducto
        fields = [
            'id', 'refaccion', 'usuario', 'usuario_nombre', 'usuario_email',
            'calificacion', 'comentario', 'activo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'usuario']
        extra_kwargs = {
            'refaccion': {'write_only': True},
            'activo': {'required': False}
        }

    def create(self, validated_data):
        # El usuario se asigna automáticamente desde el request
        validated_data['usuario'] = self.context['request'].user
        # Asegurar que activo sea True por defecto
        if 'activo' not in validated_data:
            validated_data['activo'] = True
        return super().create(validated_data)
