"""
Servicios para procesar pedidos después de la aprobación del pago
"""
from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError

from apps.inventario.services import registrar_salida_por_compra
from apps.ventas.models import Ventas
from .models import Pedido


def procesar_pedido_pagado(pedido_id):
    """
    Procesa un pedido después de que el pago haya sido aprobado.
    Esto incluye:
    - Registrar salidas de inventario
    - Registrar ventas
    - Actualizar estado del pedido
    """
    try:
        pedido = Pedido.objects.select_related('usuario').prefetch_related('items__refaccion').get(id=pedido_id)
        
        # Verificar que el pedido esté en estado CREADO
        if pedido.estado != Pedido.EstadoChoices.CREADO:
            raise ValueError(f'El pedido {pedido_id} ya fue procesado o está en estado {pedido.estado}')
        
        movimientos = []
        with transaction.atomic():
            # Procesar cada item del pedido
            for item in pedido.items.all():
                # Registrar salida de inventario
                movimiento = registrar_salida_por_compra(
                    refaccion=item.refaccion,
                    cantidad=item.cantidad,
                )
                movimientos.append(movimiento)
                
                # Registrar venta
                Ventas.objects.create(
                    usuario=pedido.usuario,
                    marca=movimiento.marca,
                    refaccion=item.refaccion,
                    cantidad=movimiento.cantidad,
                    precio_unitario=movimiento.precio_unitario,
                    total=item.subtotal,
                )
            
            # Actualizar estado del pedido a PAGADO
            pedido.estado = Pedido.EstadoChoices.PAGADO
            pedido.save(update_fields=['estado'])
        
        return {
            'pedido_id': pedido.id,
            'movimientos': movimientos,
            'success': True
        }
    
    except Pedido.DoesNotExist:
        raise ValueError(f'Pedido {pedido_id} no encontrado')
    except Exception as e:
        raise ValueError(f'Error al procesar pedido: {str(e)}')

