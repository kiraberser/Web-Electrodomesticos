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
    metodo_pago = serializers.SerializerMethodField()
    metodo_pago_display = serializers.SerializerMethodField()
    pago_id = serializers.SerializerMethodField()
    pago_status = serializers.SerializerMethodField()
    pago_status_display = serializers.SerializerMethodField()
    pago_status_detail = serializers.SerializerMethodField()
    pago_payment_id = serializers.SerializerMethodField()
    pago_fecha_creacion = serializers.SerializerMethodField()
    pago_fecha_aprobacion = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            'id', 
            'estado', 
            'total', 
            'fecha_creacion', 
            'items', 
            'usuario_nombre', 
            'usuario_email', 
            'metodo_pago',
            'metodo_pago_display',
            'pago_id',
            'pago_status',
            'pago_status_display',
            'pago_status_detail',
            'pago_payment_id',
            'pago_fecha_creacion',
            'pago_fecha_aprobacion',
        ]

    def get_usuario_nombre(self, obj):
        """Retorna el nombre completo del usuario o username si no tiene nombre"""
        if obj.usuario.first_name or obj.usuario.last_name:
            nombre_completo = f"{obj.usuario.first_name or ''} {obj.usuario.last_name or ''}".strip()
            return nombre_completo if nombre_completo else obj.usuario.username
        return obj.usuario.username

    def get_metodo_pago(self, obj):
        """Retorna el método de pago formateado desde la relación con Pago (mantiene compatibilidad)"""
        return self.get_metodo_pago_display(obj)

    def get_metodo_pago_display(self, obj):
        """Retorna el método de pago formateado desde la relación con Pago"""
        try:
            pago = obj.pago
            if not pago:
                return 'No especificado'
            
            # Mapeo de payment_type_id (tipo principal de pago)
            tipo_map = {
                'credit_card': 'Tarjeta de crédito',
                'debit_card': 'Tarjeta de débito',
                'ticket': 'Efectivo',
                'bank_transfer': 'Transferencia bancaria',
                'account_money': 'Dinero en cuenta',
                'atm': 'Cajero automático',
            }
            
            # Mapeo de payment_method_id (método específico)
            metodo_map = {
                'visa': 'Visa',
                'master': 'Mastercard',
                'amex': 'American Express',
                'oxxo': 'OXXO',
                'spei': 'SPEI',
                'account_money': 'Dinero en cuenta',
                'ticket': 'Efectivo',
                'bank_transfer': 'Transferencia bancaria',
                'atm': 'Cajero automático',
            }
            
            # Priorizar payment_type_id si existe
            if pago.payment_type_id:
                tipo = tipo_map.get(pago.payment_type_id.lower(), pago.payment_type_id.title())
                
                # Si también hay payment_method_id, agregarlo como detalle
                if pago.payment_method_id and pago.payment_method_id.lower() not in ['credit_card', 'debit_card', 'ticket']:
                    metodo = metodo_map.get(pago.payment_method_id.lower(), pago.payment_method_id.title())
                    # Solo agregar si es diferente y aporta información
                    if metodo.lower() != tipo.lower() and metodo.lower() not in ['tarjeta de crédito', 'tarjeta de débito']:
                        return f"{tipo} - {metodo}"
                
                return tipo
            
            # Si solo hay payment_method_id
            if pago.payment_method_id:
                return metodo_map.get(pago.payment_method_id.lower(), pago.payment_method_id.title())
            
            return 'No especificado'
        except Exception:
            return 'No especificado'

    def get_pago_id(self, obj):
        """Retorna el ID del pago asociado"""
        try:
            return obj.pago.id if obj.pago else None
        except Exception:
            return None

    def get_pago_status(self, obj):
        """Retorna el status del pago"""
        try:
            return obj.pago.status if obj.pago else None
        except Exception:
            return None

    def get_pago_status_display(self, obj):
        """Retorna el status del pago formateado"""
        try:
            if obj.pago:
                return obj.pago.get_status_display()
            return None
        except Exception:
            return None

    def get_pago_status_detail(self, obj):
        """Retorna el detalle del status del pago"""
        try:
            return obj.pago.status_detail if obj.pago else None
        except Exception:
            return None

    def get_pago_payment_id(self, obj):
        """Retorna el payment_id de Mercado Pago"""
        try:
            return obj.pago.payment_id if obj.pago else None
        except Exception:
            return None

    def get_pago_fecha_creacion(self, obj):
        """Retorna la fecha de creación del pago"""
        try:
            return obj.pago.fecha_creacion if obj.pago else None
        except Exception:
            return None

    def get_pago_fecha_aprobacion(self, obj):
        """Retorna la fecha de aprobación del pago"""
        try:
            return obj.pago.fecha_aprobacion if obj.pago else None
        except Exception:
            return None


