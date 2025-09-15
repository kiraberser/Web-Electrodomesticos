from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from apps.productos.models import Refaccion
from apps.inventario.services import registrar_salida_por_compra
from apps.inventario.serializer import InventarioSerializer
from .models import Pedido, PedidoItem
from apps.ventas.models import Ventas


class CheckoutItemSerializer(serializers.Serializer):
    refaccion = serializers.PrimaryKeyRelatedField(queryset=Refaccion.objects.all())
    cantidad = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    items = CheckoutItemSerializer(many=True)

    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            raise serializers.ValidationError({'detail': 'Autenticación requerida para checkout'})

        movimientos = []
        with transaction.atomic():
            pedido = Pedido.objects.create(usuario=user, estado=Pedido.EstadoChoices.PAGADO, total=0)
            total = 0

            for item in validated_data['items']:
                try:
                    movimiento = registrar_salida_por_compra(
                        refaccion=item['refaccion'],
                        cantidad=item['cantidad'],
                    )
                    movimientos.append(movimiento)
                    subtotal = movimiento.cantidad * movimiento.precio_unitario
                    # Guardar item del pedido
                    PedidoItem.objects.create(
                        pedido=pedido,
                        refaccion=item['refaccion'],
                        cantidad=item['cantidad'],
                        precio_unitario=movimiento.precio_unitario,
                        subtotal=subtotal,
                    )
                    # Registrar venta
                    Ventas.objects.create(
                        usuario=user,
                        marca=movimiento.marca,
                        refaccion=item['refaccion'],
                        cantidad=movimiento.cantidad,
                        precio_unitario=movimiento.precio_unitario,
                        total=subtotal,
                    )
                    total += subtotal
                except DjangoValidationError as e:
                    raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else {'detail': e.messages})
                except ValueError as e:
                    raise serializers.ValidationError({'detail': str(e)})
            pedido.total = total
            pedido.save(update_fields=['total'])
        # Representación de respuesta
        return {
            'pedido_id': pedido.id,
            'total': str(pedido.total),
            'movimientos': InventarioSerializer(movimientos, many=True).data,
        }


class PedidoItemListSerializer(serializers.ModelSerializer):
    refaccion_nombre = serializers.ReadOnlyField(source='refaccion.nombre')

    class Meta:
        model = PedidoItem
        fields = ['id', 'refaccion', 'refaccion_nombre', 'cantidad', 'precio_unitario', 'subtotal']


class PedidoListSerializer(serializers.ModelSerializer):
    items = PedidoItemListSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'estado', 'total', 'fecha_creacion', 'items']


