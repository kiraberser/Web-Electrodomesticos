from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Marca, Categoria, Refaccion, Proveedor
from .serializers import (
    MarcaSerializer, 
    CategoriaSerializer, 
    RefaccionSerializer, 
    ProveedorSerializer, 
)

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'pais_origen']
    ordering_fields = ['nombre']

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']

class RefaccionViewSet(viewsets.ModelViewSet):
    queryset = Refaccion.objects.select_related('marca', 'categoria').all()
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

    
class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'contacto', 'correo_electronico']
    ordering_fields = ['nombre']
