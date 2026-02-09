from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models.deletion import ProtectedError
from django.db import models, transaction
from .models import Marca, Categoria, Refaccion, Proveedor, ComentarioProducto
from .serializers import (
    MarcaSerializer, 
    CategoriaSerializer, 
    RefaccionSerializer, 
    ProveedorSerializer,
    ComentarioProductoSerializer,
)
from apps.inventario.models import Inventario

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all().order_by('nombre')
    serializer_class = MarcaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'pais_origen']
    ordering_fields = ['nombre']

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('nombre')
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']

class RefaccionViewSet(viewsets.ModelViewSet):
    queryset = Refaccion.objects.select_related('categoria', 'proveedor').all()
    serializer_class = RefaccionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    filterset_fields = ['marca', 'categoria', 'estado']
    search_fields = ['nombre', 'codigo_parte', 'compatibilidad']
    ordering_fields = ['precio', 'fecha_ingreso', 'existencias']

    def destroy(self, request, *args, **kwargs):
        """Sobrescribe destroy para manejar ProtectedError y permitir eliminación si todos los pedidos están entregados"""
        refaccion = self.get_object()
        from apps.pedidos.models import Pedido
        
        # Verificar cuántos pedidos NO entregados referencian esta refacción
        pedidos_no_entregados = refaccion.pedido_items.filter(
            ~models.Q(pedido__estado=Pedido.EstadoChoices.ENTREGADO)
        ).values('pedido').distinct().count()
        
        pedidos_totales = refaccion.pedido_items.values('pedido').distinct().count()
        
        if pedidos_no_entregados > 0:
            return Response(
                {
                    'error': 'No se puede eliminar esta refacción',
                    'detail': f'Esta refacción está siendo utilizada en {pedidos_no_entregados} pedido(s) que aún no han sido entregados y no puede ser eliminada para mantener la integridad de los datos.',
                    'pedidos_no_entregados': pedidos_no_entregados,
                    'pedidos_totales': pedidos_totales
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Si todos los pedidos están entregados, intentar eliminar
        # Como PROTECT bloquea a nivel de DB, necesitamos eliminar manualmente los items primero
        try:
            with transaction.atomic():
                # Eliminar todos los PedidoItem que referencian esta refacción
                # Solo si todos los pedidos están entregados
                refaccion.pedido_items.all().delete()
                # Ahora podemos eliminar la refacción
                refaccion.delete()
            
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            # Si aún hay algún problema, devolver error
            return Response(
                {
                    'error': 'No se puede eliminar esta refacción',
                    'detail': 'Ocurrió un error al intentar eliminar la refacción. Verifique que todos los pedidos relacionados estén entregados.',
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    
class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all().order_by('nombre')
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'contacto', 'correo_electronico']
    ordering_fields = ['nombre']


# Vistas personalizadas para URLs específicas
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def refacciones_por_categoria(request, categoria_id):
    """
    Vista para obtener refacciones (productos) filtradas por categoría específica
    """
    try:
        # Obtener la categoría por ID
        categoria = get_object_or_404(Categoria, id=categoria_id)
        
        # Filtrar refacciones por categoría
        refacciones = Refaccion.objects.filter(categoria=categoria).select_related('categoria', 'proveedor')
        
        # Aplicar filtros adicionales si se proporcionan
        marca = request.query_params.get('marca', None)
        estado = request.query_params.get('estado', None)
        
        if marca:
            refacciones = refacciones.filter(marca__icontains=marca)
        if estado:
            refacciones = refacciones.filter(estado=estado)
        
        serializer = RefaccionSerializer(refacciones, many=True)
        
        return Response({
            'categoria': CategoriaSerializer(categoria).data,
            'refacciones': serializer.data,
            'total': refacciones.count()
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error al obtener refacciones: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ComentarioProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar comentarios/opiniones de productos
    """
    serializer_class = ComentarioProductoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'calificacion']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Filtra comentarios por producto si se proporciona refaccion_id
        Solo muestra comentarios activos para usuarios no autenticados
        """
        queryset = ComentarioProducto.objects.select_related('usuario', 'refaccion').all()
        
        # Filtrar por producto si se proporciona
        refaccion_id = self.request.query_params.get('refaccion_id', None)
        if refaccion_id:
            try:
                refaccion_id_int = int(refaccion_id)
                queryset = queryset.filter(refaccion_id=refaccion_id_int)
            except (ValueError, TypeError):
                # Si no se puede convertir a int, ignorar el filtro
                pass
        
        # Solo mostrar comentarios activos (para todos los usuarios en listado público)
        if self.action == 'list':
            queryset = queryset.filter(activo=True)
        
        return queryset

    def get_permissions(self):
        """
        Define permisos por acción:
        - list/retrieve: acceso público (solo comentarios activos)
        - create/update/destroy: requiere autenticación
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [p() for p in permission_classes]

    def perform_create(self, serializer):
        """
        Asigna automáticamente el usuario autenticado al comentario
        """
        serializer.save(usuario=self.request.user)

    def update(self, request, *args, **kwargs):
        """
        Solo permite que el usuario edite sus propios comentarios
        """
        instance = self.get_object()
        if instance.usuario != request.user:
            return Response(
                {'error': 'No tienes permiso para editar este comentario'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Solo permite que el usuario elimine sus propios comentarios
        """
        instance = self.get_object()
        if instance.usuario != request.user:
            return Response(
                {'error': 'No tienes permiso para eliminar este comentario'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)