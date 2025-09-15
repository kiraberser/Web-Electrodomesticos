from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import Inventario
from apps.productos.models import Refaccion
from .services import registrar_salida_por_compra, registrar_entrada_manual, registrar_entrada_por_devolucion
from apps.ventas.models import Devolucion, Ventas


class InventarioSerializer(serializers.ModelSerializer):
    refaccion = serializers.PrimaryKeyRelatedField(queryset=Refaccion.objects.all())
    refaccion_nombre = serializers.ReadOnlyField(source='refaccion.nombre')
    marca = serializers.ReadOnlyField(source='marca.nombre')
    categoria = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Inventario
        fields = ['id', 'refaccion', 'refaccion_nombre', 'cantidad', 'precio_unitario', 'marca', 'categoria', 'tipo_movimiento']
        read_only_fields = ['precio_unitario', 'marca', 'categoria']

    def create(self, validated_data):
        # El modelo gestiona validación y actualización de existencias
        try:
            return super().create(validated_data)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else {'detail': e.messages})


class RegistrarSalidaSerializer(serializers.Serializer):
    refaccion = serializers.PrimaryKeyRelatedField(queryset=Refaccion.objects.all())
    cantidad = serializers.IntegerField(min_value=1)

    def create(self, validated_data):
        try:
            movimiento = registrar_salida_por_compra(
                refaccion=validated_data['refaccion'],
                cantidad=validated_data['cantidad'],
            )
            return movimiento
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else {'detail': e.messages})
        except ValueError as e:
            raise serializers.ValidationError({'detail': str(e)})


class RegistrarEntradaSerializer(serializers.Serializer):
    refaccion = serializers.PrimaryKeyRelatedField(queryset=Refaccion.objects.all())
    cantidad = serializers.IntegerField(min_value=1)
    precio_unitario = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)

    def create(self, validated_data):
        try:
            movimiento = registrar_entrada_manual(
                refaccion=validated_data['refaccion'],
                cantidad=validated_data['cantidad'],
                precio_unitario=validated_data.get('precio_unitario'),
            )
            return movimiento
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else {'detail': e.messages})
        except ValueError as e:
            raise serializers.ValidationError({'detail': str(e)})


class RegistrarDevolucionSerializer(serializers.Serializer):
    refaccion = serializers.PrimaryKeyRelatedField(queryset=Refaccion.objects.all())
    cantidad = serializers.IntegerField(min_value=1)
    precio_unitario = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    venta_id = serializers.IntegerField(required=False)
    motivo = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def create(self, validated_data):
        try:
            movimiento = registrar_entrada_por_devolucion(
                refaccion=validated_data['refaccion'],
                cantidad=validated_data['cantidad'],
                precio_unitario=validated_data.get('precio_unitario'),
            )
            # Registrar la devolución en ventas
            venta = None
            venta_id = validated_data.get('venta_id')
            if venta_id:
                try:
                    venta = Ventas.objects.get(pk=venta_id)
                except Ventas.DoesNotExist:
                    venta = None
            Devolucion.objects.create(
                venta=venta,
                marca=movimiento.marca,
                refaccion=validated_data['refaccion'],
                cantidad=validated_data['cantidad'],
                precio_unitario=movimiento.precio_unitario,
                total=movimiento.cantidad * movimiento.precio_unitario,
                motivo=validated_data.get('motivo')
            )
            return movimiento
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else {'detail': e.messages})
        except ValueError as e:
            raise serializers.ValidationError({'detail': str(e)})
