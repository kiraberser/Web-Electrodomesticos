from rest_framework import viewsets
from .models import Servicio, ServicioReparado
from .serializers import ServicioSerializer, ServicioReparadoSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all().order_by('-noDeServicio')
    serializer_class = ServicioSerializer

class ServicioReparadoViewSet(viewsets.ModelViewSet):
    queryset = ServicioReparado.objects.all().order_by('-noDeServicio')
    serializer_class = ServicioReparadoSerializer
    def get_queryset(self):
        # Filtrar los servicios reparados que están entregados
        return self.queryset.filter(servicio__estado='Entregado').order_by('-fecha_reparacion')