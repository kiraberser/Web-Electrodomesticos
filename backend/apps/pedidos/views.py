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
        pedidos = Pedido.objects.filter(usuario=request.user).select_related('usuario').prefetch_related('items__refaccion')
        data = PedidoListSerializer(pedidos, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    
class AllPedidosView(APIView):
    permission_classes = [permissions.IsAdminUser]
    pagination_class = PedidoPagination

    def get(self, request):
        pedidos = Pedido.objects.all().select_related('usuario').prefetch_related('items__refaccion')
        
        # Aplicar paginación
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(pedidos, request)
        
        if page is not None:
            serializer = PedidoListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # Si no hay paginación, retornar todos (no debería pasar con paginación activa)
        serializer = PedidoListSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

