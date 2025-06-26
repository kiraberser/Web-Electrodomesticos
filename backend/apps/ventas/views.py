from django.shortcuts import render
from rest_framework import viewsets, permissions, filters


from apps.inventario.models import Inventario
from .models import Ventas
from .serializers import VentasSerializer

# Create your views here.
class VentasViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar las ventas de refacciones.
    Permite listar, crear, actualizar y eliminar ventas.
    """
    queryset = Ventas.objects.all()
    serializer_class = VentasSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['refaccion__nombre', 'marca']
    ordering_fields = ['fecha_venta', 'total']

    def perform_create(self, serializer):
        # Aquí podrías agregar lógica adicional al crear una venta
        venta = serializer.save()
        # Actualizar el inventario después de crear una venta
        inventario = Inventario.objects.get(refaccion=venta.refaccion)
        inventario.cantidad -= venta.cantidad
        inventario.save()