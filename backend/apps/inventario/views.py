from django.shortcuts import render
from rest_framework import permissions
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Inventario
from .serializer import (
    InventarioSerializer,
    RegistrarSalidaSerializer,
    RegistrarEntradaSerializer,
    RegistrarDevolucionSerializer,
)
from .services import registrar_salida_por_compra
from apps.productos.models import Refaccion

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
        # Ya no ajustamos existencias aquí; el modelo/ señal lo hace atómicamente
        serializer.save()

    @action(detail=False, methods=['post'], url_path='salida')
    def registrar_salida(self, request):
        """Endpoint para registrar SALIDA por compra.

        Payload: { "refaccion": id, "cantidad": n }
        Maneja errores de dominio via serializer para el frontend.
        """
        serializer = RegistrarSalidaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movimiento = serializer.save()
        return Response(InventarioSerializer(movimiento).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='entrada')
    def registrar_entrada(self, request):
        """Endpoint para registrar ENTRADA manual."""
        serializer = RegistrarEntradaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movimiento = serializer.save()
        return Response(InventarioSerializer(movimiento).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='devolucion')
    def registrar_devolucion(self, request):
        """Endpoint para registrar ENTRADA por devolución."""
        serializer = RegistrarDevolucionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movimiento = serializer.save()
        return Response(InventarioSerializer(movimiento).data, status=status.HTTP_201_CREATED)