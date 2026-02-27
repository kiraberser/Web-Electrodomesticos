from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q, Sum
from django.utils import timezone
from datetime import timedelta

from .serializers import CheckoutSerializer, PedidoListSerializer
from .models import Pedido
from .pagination import PedidoPagination, PedidoPagadoPagination

class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_201_CREATED)

class MisPedidosView(APIView):
    """Obtiene todos los pedidos del usuario con paginación
    
    Solo muestra pedidos:
    - Pagados (estado PAG, ENV)
    - Creados sin pagar (estado CRE) que tengan menos de 3 días
    
    Excluye:
    - Pedidos entregados (estado ENT)
    - Pedidos cancelados (estado CAN)
    - Pedidos creados sin pagar con más de 3 días
    """
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PedidoPagination

    def get(self, request):
        # Fecha límite: 3 días atrás
        fecha_limite = timezone.now() - timedelta(days=3)
        
        # Filtrar pedidos:
        # 1. Pagados (PAG) o Enviados (ENV) - siempre se muestran
        # 2. Creados (CRE) sin pago aprobado que tengan menos de 3 días
        pedidos = Pedido.objects.filter(
            usuario=request.user
        ).exclude(
            estado__in=['ENT', 'CAN']  # Excluir entregados y cancelados
        ).filter(
            # Pedidos pagados/enviados O pedidos creados recientes sin pagar
            Q(
                estado__in=['PAG', 'ENV']
            ) | Q(
                estado='CRE',
                fecha_creacion__gte=fecha_limite,  # Menos de 3 días
                pago__status__isnull=True  # Sin pago
            ) | Q(
                estado='CRE',
                fecha_creacion__gte=fecha_limite,
                pago__status__in=['PEN', 'REC', 'CAN']  # Pago pendiente, rechazado o cancelado
            )
        ).select_related('usuario', 'pago').prefetch_related('items__refaccion').order_by('-fecha_creacion')
        
        # Aplicar paginación
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(pedidos, request)
        
        if page is not None:
            serializer = PedidoListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # Si no hay paginación, retornar todos (no debería pasar con paginación activa)
        serializer = PedidoListSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MisPedidosPagadosView(APIView):
    """Obtiene solo los pedidos entregados del usuario (para compras)"""
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PedidoPagadoPagination

    def get(self, request):
        # Filtrar solo pedidos entregados (estado ENT) con pago aprobado
        pedidos = Pedido.objects.filter(
            usuario=request.user,
            estado='ENT',  # Solo pedidos entregados
            pago__status='APR'  # Con pago aprobado
        ).select_related('usuario', 'pago').prefetch_related('items__refaccion').order_by('-fecha_creacion')
        
        # Aplicar paginación
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(pedidos, request)
        
        if page is not None:
            serializer = PedidoListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # Si no hay paginación, retornar todos (no debería pasar con paginación activa)
        serializer = PedidoListSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AllPedidosView(APIView):
    permission_classes = [permissions.IsAdminUser]
    pagination_class = PedidoPagination

    def get(self, request):
        pedidos = Pedido.objects.all().select_related('usuario', 'pago').prefetch_related('items__refaccion')
        
        # Aplicar paginación
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(pedidos, request)
        
        if page is not None:
            serializer = PedidoListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # Si no hay paginación, retornar todos (no debería pasar con paginación activa)
        serializer = PedidoListSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


def _enviar_email_pedido_enviado(pedido):
    """Envía email de notificación cuando un pedido cambia a estado ENV (Enviado)."""
    try:
        import brevo_python
        from django.conf import settings
        if not getattr(settings, 'BREVO_API_KEY', None):
            return
        if not getattr(settings, 'BREVO_SENDER_EMAIL', None):
            return
        if not pedido.usuario.email:
            return

        nombre = pedido.usuario.first_name or pedido.usuario.username
        empresa = getattr(settings, 'COMPANY_NAME', 'Refaccionaria Vega')

        items_html = ''.join(
            f'<tr>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;">{item.refaccion.nombre}</td>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">{item.cantidad}</td>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${float(item.precio_unitario):,.2f}</td>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${float(item.subtotal):,.2f}</td>'
            f'</tr>'
            for item in pedido.items.select_related('refaccion').all()
        )

        tracking_html = ''
        if pedido.numero_seguimiento:
            tracking_html = f"""
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:20px 0;">
                <p style="margin:0 0 4px;font-size:12px;color:#3b82f6;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
                    Número de seguimiento
                </p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#1e40af;font-family:monospace;">
                    {pedido.numero_seguimiento}
                </p>
            </div>
            """

        direccion_html = ''
        try:
            addr = pedido.usuario.direcciones.filter(is_primary=True).first()
            if not addr:
                addr = pedido.usuario.direcciones.order_by('-id').first()
            if addr:
                direccion_html = f"""
            <div style="margin-top:20px;">
                <p style="font-size:14px;font-weight:600;color:#374151;margin-bottom:6px;">📍 Dirección de entrega:</p>
                <p style="font-size:14px;color:#6b7280;margin:0;">
                    {addr.nombre}<br>
                    {addr.street}<br>
                    {addr.colony}, {addr.city}<br>
                    {addr.state} CP {addr.postal_code}
                </p>
            </div>
                """
        except Exception:
            pass

        html_content = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
            <div style="background:#0A3981;border-radius:10px 10px 0 0;padding:24px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:22px;">📦 Tu pedido fue enviado</h1>
            </div>
            <div style="background:#ffffff;border-radius:0 0 10px 10px;padding:28px;border:1px solid #e5e7eb;border-top:none;">
                <p style="color:#374151;font-size:15px;">Hola <strong>{nombre}</strong>,</p>
                <p style="color:#374151;font-size:15px;">
                    ¡Buenas noticias! Tu pedido <strong>#{pedido.id}</strong> ha sido enviado y está en camino.
                </p>

                {tracking_html}

                <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:10px 8px;text-align:left;color:#374151;">Producto</th>
                            <th style="padding:10px 8px;text-align:center;color:#374151;">Cant.</th>
                            <th style="padding:10px 8px;text-align:right;color:#374151;">Precio</th>
                            <th style="padding:10px 8px;text-align:right;color:#374151;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:700;color:#374151;">Total:</td>
                            <td style="padding:12px 8px;text-align:right;font-weight:700;color:#0A3981;font-size:16px;">
                                ${float(pedido.total):,.2f} MXN
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {direccion_html}

                <p style="color:#6b7280;font-size:13px;margin-top:24px;">
                    Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                </p>
                <p style="color:#374151;margin-top:20px;">
                    Saludos,<br>
                    <strong>Equipo de {empresa}</strong>
                </p>
            </div>
            <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:16px;">
                Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
            </p>
        </div>
        """

        configuration = brevo_python.Configuration()
        configuration.api_key['api-key'] = settings.BREVO_API_KEY
        api = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(configuration))
        api.send_transac_email(brevo_python.SendSmtpEmail(
            to=[{"email": pedido.usuario.email}],
            subject=f'Tu pedido #{pedido.id} fue enviado — {empresa}',
            html_content=html_content,
            sender={
                "email": settings.BREVO_SENDER_EMAIL,
                "name": getattr(settings, 'BREVO_SENDER_NAME', empresa),
            },
        ))
    except Exception as e:
        from django.conf import settings as _s
        if getattr(_s, 'DEBUG', False):
            print(f"Error enviando email de envío (pedido #{pedido.id}): {e}")


def _enviar_email_pedido_entregado(pedido):
    """Envía email de notificación cuando un pedido cambia a estado ENT (Entregado)."""
    try:
        import brevo_python
        from django.conf import settings
        if not getattr(settings, 'BREVO_API_KEY', None):
            return
        if not getattr(settings, 'BREVO_SENDER_EMAIL', None):
            return
        if not pedido.usuario.email:
            return

        nombre = pedido.usuario.first_name or pedido.usuario.username
        empresa = getattr(settings, 'COMPANY_NAME', 'Refaccionaria Vega')

        items_html = ''.join(
            f'<tr>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;">{item.refaccion.nombre}</td>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">{item.cantidad}</td>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${float(item.precio_unitario):,.2f}</td>'
            f'<td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${float(item.subtotal):,.2f}</td>'
            f'</tr>'
            for item in pedido.items.select_related('refaccion').all()
        )

        html_content = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
            <div style="background:#059669;border-radius:10px 10px 0 0;padding:24px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:22px;">✅ Tu pedido fue entregado</h1>
            </div>
            <div style="background:#ffffff;border-radius:0 0 10px 10px;padding:28px;border:1px solid #e5e7eb;border-top:none;">
                <p style="color:#374151;font-size:15px;">Hola <strong>{nombre}</strong>,</p>
                <p style="color:#374151;font-size:15px;">
                    ¡Tu pedido <strong>#{pedido.id}</strong> ha sido entregado exitosamente!
                    Esperamos que estés satisfecho con tu compra.
                </p>

                <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:16px;margin:20px 0;">
                    <p style="margin:0;font-size:15px;color:#065f46;font-weight:600;">
                        🎉 ¡Entrega completada! Gracias por tu compra en {empresa}.
                    </p>
                </div>

                <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:10px 8px;text-align:left;color:#374151;">Producto</th>
                            <th style="padding:10px 8px;text-align:center;color:#374151;">Cant.</th>
                            <th style="padding:10px 8px;text-align:right;color:#374151;">Precio</th>
                            <th style="padding:10px 8px;text-align:right;color:#374151;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:700;color:#374151;">Total:</td>
                            <td style="padding:12px 8px;text-align:right;font-weight:700;color:#059669;font-size:16px;">
                                ${float(pedido.total):,.2f} MXN
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <p style="color:#6b7280;font-size:13px;margin-top:24px;">
                    Si tienes algún problema con tu pedido, contáctanos y con gusto te ayudaremos.
                </p>
                <p style="color:#374151;margin-top:20px;">
                    ¡Hasta la próxima!<br>
                    <strong>Equipo de {empresa}</strong>
                </p>
            </div>
            <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:16px;">
                Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
            </p>
        </div>
        """

        configuration = brevo_python.Configuration()
        configuration.api_key['api-key'] = settings.BREVO_API_KEY
        api = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(configuration))
        api.send_transac_email(brevo_python.SendSmtpEmail(
            to=[{"email": pedido.usuario.email}],
            subject=f'Tu pedido #{pedido.id} fue entregado — {empresa}',
            html_content=html_content,
            sender={
                "email": settings.BREVO_SENDER_EMAIL,
                "name": getattr(settings, 'BREVO_SENDER_NAME', empresa),
            },
        ))
    except Exception as e:
        from django.conf import settings as _s
        if getattr(_s, 'DEBUG', False):
            print(f"Error enviando email de entrega (pedido #{pedido.id}): {e}")


class UpdatePedidoEstadoView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pedido_id):
        """Actualiza el estado y/o número de seguimiento de un pedido"""
        try:
            pedido = Pedido.objects.select_related('usuario', 'pago').prefetch_related('items__refaccion').get(id=pedido_id)
        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        nuevo_estado = request.data.get('estado')
        numero_seguimiento = request.data.get('numero_seguimiento')

        estado_anterior = pedido.estado
        update_fields = []

        if nuevo_estado:
            estados_validos = [choice[0] for choice in Pedido.EstadoChoices.choices]
            if nuevo_estado not in estados_validos:
                return Response(
                    {'error': f'Estado inválido. Válidos: {", ".join(estados_validos)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            pedido.estado = nuevo_estado
            update_fields.append('estado')

        if numero_seguimiento is not None:
            pedido.numero_seguimiento = numero_seguimiento
            update_fields.append('numero_seguimiento')

        if not update_fields:
            return Response({'error': 'Sin campos a actualizar'}, status=status.HTTP_400_BAD_REQUEST)

        pedido.save(update_fields=update_fields)

        # Enviar notificación por email si el estado cambió
        if nuevo_estado and nuevo_estado != estado_anterior:
            if nuevo_estado == 'ENV':
                _enviar_email_pedido_enviado(pedido)
            elif nuevo_estado == 'ENT':
                _enviar_email_pedido_entregado(pedido)

        serializer = PedidoListSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PedidosStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        qs = Pedido.objects.all()
        total = qs.count()
        revenue = qs.aggregate(total=Sum('total'))['total'] or 0
        por_estado = {e: qs.filter(estado=e).count() for e in ['CRE', 'PAG', 'ENV', 'ENT', 'CAN']}
        por_pago = {
            'APR': qs.filter(pago__status='APR').count(),
            'PEN': qs.filter(pago__status='PEN').count(),
            'REJ': qs.exclude(pago__status__in=['APR', 'PEN']).filter(pago__isnull=False).count(),
            'sin_pago': qs.filter(pago__isnull=True).count(),
        }
        return Response({
            'total': total,
            'revenue': float(revenue),
            'por_estado': por_estado,
            'por_pago': por_pago,
        })

