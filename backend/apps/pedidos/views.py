from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q
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


class UpdatePedidoEstadoView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pedido_id):
        """Actualiza el estado de un pedido"""
        try:
            pedido = Pedido.objects.get(id=pedido_id)
        except Pedido.DoesNotExist:
            return Response(
                {'error': 'Pedido no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        nuevo_estado = request.data.get('estado')
        
        if not nuevo_estado:
            return Response(
                {'error': 'El campo "estado" es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar que el estado sea válido
        estados_validos = [choice[0] for choice in Pedido.EstadoChoices.choices]
        if nuevo_estado not in estados_validos:
            return Response(
                {'error': f'Estado inválido. Estados válidos: {", ".join(estados_validos)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pedido.estado = nuevo_estado
        pedido.save(update_fields=['estado'])
        
        serializer = PedidoListSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)

