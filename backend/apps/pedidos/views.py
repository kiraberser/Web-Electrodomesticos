from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .serializers import CheckoutSerializer, PedidoListSerializer
from .models import Pedido
from .pagination import PedidoPagination

class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_201_CREATED)

class MisPedidosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pedidos = Pedido.objects.filter(usuario=request.user).select_related('usuario', 'pago').prefetch_related('items__refaccion')
        data = PedidoListSerializer(pedidos, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    
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

