from django.core.exceptions import ObjectDoesNotExist

from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError


from .models import Ventas
from .serializers import VentasSerializer, VentasServiciosSerializer

from apps.inventario.models import Inventario
from apps.productos.models import Refaccion
from apps.servicios.models import Servicio
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
        refaccion = serializer.validated_data['refaccion']
        cantidad = serializer.validated_data['cantidad']
        marca = serializer.validated_data['marca']

        inventario = Inventario.objects.get(refaccion=refaccion, marca=marca)
        
        if inventario.cantidad < cantidad:
            raise ValidationError("No hay suficiente inventario para completar la venta.")
        else:
            inventario.cantidad -= cantidad
            inventario.save()

        total_venta = inventario.precio_unitario * cantidad
        serializer.save(refaccion=refaccion, cantidad=cantidad, marca=marca, total=total_venta, precio_unitario=inventario.precio_unitario)

        try:
            update_refaccion = Refaccion.objects.get(id=refaccion.id)
            update_refaccion.existencias -= cantidad
            update_refaccion.save()
        except ObjectDoesNotExist:
            raise ValidationError("La refacción no existe o no se pudo actualizar el inventario.")

class VentasServiciosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar las ventas de servicios.
    Permite listar, crear, actualizar y eliminar ventas de servicios.
    """
    queryset = Servicio.objects.filter(estado='entregado')
    serializer_class = VentasServiciosSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['servicio__aparato']
    ordering_fields = ['fecha_venta', 'total']

    def perform_create(self, serializer):
        # Aquí podrías agregar lógica adicional al crear una venta de servicio
        servicio = serializer.validated_data['servicio']
        precio_unitario = servicio.precio_unitario
        costo = servicio.costo
        total_venta = precio_unitario - costo  # Asumiendo que es una venta por servicio

        serializer.save(precio_unitario=precio_unitario, total=total_venta, costo=costo)