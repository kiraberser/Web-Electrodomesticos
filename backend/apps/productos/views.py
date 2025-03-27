from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Marca, Categoria, Refaccion, Proveedor, Inventario
from .serializers import (
    MarcaSerializer, 
    CategoriaSerializer, 
    RefaccionSerializer, 
    ProveedorSerializer, 
    InventarioSerializer
)

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'pais_origen']
    ordering_fields = ['nombre']

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']

class RefaccionViewSet(viewsets.ModelViewSet):
    queryset = Refaccion.objects.select_related('marca', 'categoria').all()
    serializer_class = RefaccionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    filterset_fields = ['marca', 'categoria', 'estado']
    search_fields = ['nombre', 'codigo_parte', 'compatibilidad']
    ordering_fields = ['precio', 'fecha_ingreso', 'existencias']

    def get_queryset(self):
        queryset = super().get_queryset()
        min_precio = self.request.query_params.get('min_precio')
        max_precio = self.request.query_params.get('max_precio')
        
        if min_precio:
            queryset = queryset.filter(precio__gte=min_precio)
        if max_precio:
            queryset = queryset.filter(precio__lte=max_precio)
        
        return queryset

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'contacto', 'correo_electronico']
    ordering_fields = ['nombre']

class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.select_related('refaccion', 'proveedor').all()
    serializer_class = InventarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    filterset_fields = ['refaccion', 'proveedor', 'tipo_movimiento']
    search_fields = ['observaciones']
    ordering_fields = ['fecha']

    def perform_create(self, serializer):
        """
        Actualiza las existencias de la refacción al crear un movimiento de inventario
        """
        movimiento = serializer.save()
        refaccion = movimiento.refaccion
        
        if movimiento.tipo_movimiento == Inventario.TipoMovimientoChoices.ENTRADA:
            refaccion.existencias += movimiento.cantidad
        else:
            refaccion.existencias -= movimiento.cantidad
        
        refaccion.save()