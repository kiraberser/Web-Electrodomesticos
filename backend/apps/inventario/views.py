from django.shortcuts import render
from rest_framework import permissions
from rest_framework import viewsets, filters

from .models import Inventario
from .serializer import InventarioSerializer

# Create your views here.
class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    filterset_fields = ['refaccion', 'tipo_movimiento']
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