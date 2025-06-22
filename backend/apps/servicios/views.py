from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Servicio, ServicioReparado
from .serializers import ServicioSerializer, ServicioReparadoSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all().order_by('-noDeServicio')
    serializer_class = ServicioSerializer

class ServicioReparadoViewSet(viewsets.ModelViewSet):
    queryset = ServicioReparado.objects.all()
    serializer_class = ServicioReparadoSerializer
    def get_queryset(self):
        # Filtrar los servicios reparados que están entregados
        return self.queryset.filter(servicio__estado='Entregado')
    
class ServiciosEntregadosView(APIView):
    """
    Devuelve los servicios reparados que están disponibles para ser entregados.
    """
    def get(self, request):
        servicios = Servicio.objects.filter(estado='Entregado').exclude(reparados__isnull=False)
        serializer = ServicioSerializer(servicios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
