from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Marca, Categoria, Refaccion, Proveedor
from .serializers import (
    MarcaSerializer, 
    CategoriaSerializer, 
    RefaccionSerializer, 
    ProveedorSerializer, 
)
from apps.inventario.models import Inventario

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