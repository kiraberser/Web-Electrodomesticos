from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from apps.productos.models import Refaccion
from .models import Pedido, PedidoItem


class CheckoutItemSerializer(serializers.Serializer):
    refaccion = serializers.PrimaryKeyRelatedField(queryset=Refaccion.objects.all())
    cantidad = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    items = CheckoutItemSerializer(many=True)

    def create(self, validated_data):
        """
        Crea un pedido en estado CREADO sin procesar inventario.
        El inventario se procesará cuando el pago sea aprobado.
        """
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            raise serializers.ValidationError({'detail': 'Autenticación requerida para checkout'})

        with transaction.atomic():
            # Crear pedido en estado CREADO (no procesar inventario aún)
            pedido = Pedido.objects.create(usuario=user, estado=Pedido.EstadoChoices.CREADO, total=0)
            total = 0

            for item in validated_data['items']:
                try:
                    # Obtener precio desde el inventario sin procesar salida
                    from apps.inventario.models import Inventario
                    inventario = Inventario.objects.filter(
                        refaccion=item['refaccion'],
                        cantidad__gt=0
                    ).order_by('fecha').first()
                    
                    if not inventario:
                        raise serializers.ValidationError({
                            'detail': f'No hay stock disponible para {item["refaccion"].nombre}'
                        })
                    
                    if inventario.cantidad < item['cantidad']:
                        raise serializers.ValidationError({
                            'detail': f'Stock insuficiente para {item["refaccion"].nombre}. Disponible: {inventario.cantidad}'
                        })
                    
                    precio_unitario = inventario.precio_unitario
                    subtotal = item['cantidad'] * precio_unitario
                    
                    # Guardar item del pedido (sin procesar inventario aún)
                    PedidoItem.objects.create(
                        pedido=pedido,
                        refaccion=item['refaccion'],
                        cantidad=item['cantidad'],
                        precio_unitario=precio_unitario,
                        subtotal=subtotal,
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
            'estado': pedido.estado,
        }


class PedidoItemListSerializer(serializers.ModelSerializer):
    refaccion_nombre = serializers.ReadOnlyField(source='refaccion.nombre')

    class Meta:
        model = PedidoItem
        fields = ['id', 'refaccion', 'refaccion_nombre', 'cantidad', 'precio_unitario', 'subtotal']


class PedidoListSerializer(serializers.ModelSerializer):
    items = PedidoItemListSerializer(many=True, read_only=True)
    usuario_nombre = serializers.SerializerMethodField()
    usuario_email = serializers.ReadOnlyField(source='usuario.email')

    class Meta:
        model = Pedido
        fields = ['id', 'estado', 'total', 'fecha_creacion', 'items', 'usuario_nombre', 'usuario_email']

    def get_usuario_nombre(self, obj):
        """Retorna el nombre completo del usuario o username si no tiene nombre"""
        if obj.usuario.first_name or obj.usuario.last_name:
            nombre_completo = f"{obj.usuario.first_name or ''} {obj.usuario.last_name or ''}".strip()
            return nombre_completo if nombre_completo else obj.usuario.username
        return obj.usuario.username


