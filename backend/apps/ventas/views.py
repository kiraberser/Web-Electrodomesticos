from rest_framework import viewsets, permissions, filters


from .models import Ventas, VentasServicios, Devolucion
from .serializers import VentasSerializer, VentasServiciosSerializer, DevolucionSerializer
# Create your views here.
class VentasViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para manejar las ventas de refacciones.
    Permite listar, crear, actualizar y eliminar ventas.
    """
    queryset = Ventas.objects.all()
    serializer_class = VentasSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['refaccion__nombre', 'marca__nombre']
    ordering_fields = ['fecha_venta', 'total']

    def get_queryset(self):
        qs = super().get_queryset()
        user = getattr(self.request, 'user', None)
        if not user or user.is_staff or user.is_superuser:
            return qs
        return qs.filter(usuario=user)

class VentasServiciosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar las ventas de servicios.
    Permite listar, crear, actualizar y eliminar ventas de servicios.
    """
    queryset = VentasServicios.objects.all()
    serializer_class = VentasServiciosSerializer
    permission_classes = [permissions.IsAdminUser]
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


class DevolucionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Devolucion.objects.all()
    serializer_class = DevolucionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = getattr(self.request, 'user', None)
        if not user or user.is_staff or user.is_superuser:
            return qs
        # Filtrar por usuario del ticket de venta
        return qs.filter(venta__usuario=user)