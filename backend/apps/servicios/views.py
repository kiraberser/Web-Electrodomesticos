from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Servicio
from .serializers import ServicioSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all().order_by('-noDeServicio')
    serializer_class = ServicioSerializer
    
class ServiciosEntregadosView(APIView):
    """
    Devuelve los servicios reparados que están disponibles para ser entregados.
    """
    def get(self, request):
        servicios = Servicio.objects.filter(estado='Entregado')
        if not servicios.exists():
            return Response({"detail": "No hay servicios entregados."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServicioSerializer(servicios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ServiciosReparadosView(APIView):
    """
    Devuelve los servicios que han sido reparados.
    """
    def get(self, request):
        servicios_reparados = Servicio.objects.filter(estado='Reparado')
        if not servicios_reparados.exists():
            return Response({"detail": "No hay servicios reparados."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServicioSerializer(servicios_reparados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)