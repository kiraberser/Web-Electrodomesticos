from django.core.exceptions import ObjectDoesNotExist

from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


from .models import Ventas, VentasServicios
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
    queryset = VentasServicios.objects.all()
    serializer_class = VentasServiciosSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['servicio__aparato']
    ordering_fields = ['fecha_venta', 'total']

    def perform_create(self, serializer):
        # total se calcula en el serializer.validate
        serializer.save()

    def get_queryset(self):
        queryset = super().get_queryset()
        servicio_id = self.request.query_params.get('servicio')
        if servicio_id:
            try:
                queryset = queryset.filter(servicio_id=servicio_id)
            except ValueError:
                pass
        return queryset