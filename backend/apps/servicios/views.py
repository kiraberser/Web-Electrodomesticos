from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.db.models import Count
from django.db.models.functions import TruncWeek
from datetime import date, timedelta

from .models import Servicio
from .serializers import ServicioSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all().order_by('-noDeServicio')
    serializer_class = ServicioSerializer
    permission_classes = [IsAdminUser]
    
class ServiciosEntregadosView(APIView):
    """
    Devuelve los servicios reparados que están disponibles para ser entregados.
    """
    permission_classes = [IsAdminUser]
    
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
    permission_classes = [IsAdminUser]

    def get(self, request):
        servicios_reparados = Servicio.objects.filter(estado='Reparado')
        if not servicios_reparados.exists():
            return Response({"detail": "No hay servicios reparados."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServicioSerializer(servicios_reparados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EstadisticasServiciosView(APIView):
    """
    Devuelve estadísticas agregadas de servicios: KPIs, distribución
    por estado/aparato/marca y tendencia semanal de los últimos 2 meses.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Servicio.objects.all()
        total = qs.count()
        pendientes = qs.filter(estado='Pendiente').count()
        completados = qs.filter(estado__in=['Reparado', 'Entregado']).count()
        tasa_completado = round((completados / total * 100), 1) if total > 0 else 0.0

        # ── Por estado ──────────────────────────────────────────────────────────
        por_estado = {
            estado: count
            for estado, count in (
                qs.values_list('estado')
                  .annotate(c=Count('noDeServicio'))
                  .order_by('-c')
            )
            if count > 0
        }

        # ── Por aparato (top 6 + Otros) ─────────────────────────────────────────
        aparatos_qs = list(
            qs.values('aparato')
              .annotate(count=Count('noDeServicio'))
              .order_by('-count')[:7]
        )
        if len(aparatos_qs) > 6:
            top = aparatos_qs[:6]
            otros = sum(a['count'] for a in aparatos_qs[6:])
            por_aparato = [{'aparato': a['aparato'], 'count': a['count']} for a in top]
            if otros:
                por_aparato.append({'aparato': 'Otros', 'count': otros})
        else:
            por_aparato = [{'aparato': a['aparato'], 'count': a['count']} for a in aparatos_qs]

        # ── Por marca (top 6 + Otros) ────────────────────────────────────────────
        marcas_qs = list(
            qs.values('marca')
              .annotate(count=Count('noDeServicio'))
              .order_by('-count')[:7]
        )
        if len(marcas_qs) > 6:
            top = marcas_qs[:6]
            otros = sum(m['count'] for m in marcas_qs[6:])
            por_marca = [{'marca': m['marca'], 'count': m['count']} for m in top]
            if otros:
                por_marca.append({'marca': 'Otros', 'count': otros})
        else:
            por_marca = [{'marca': m['marca'], 'count': m['count']} for m in marcas_qs]

        # ── Tendencia semanal (últimas 8 semanas) ────────────────────────────────
        hace_8_semanas = date.today() - timedelta(weeks=8)
        tendencia = (
            qs.filter(fecha__gte=hace_8_semanas)
              .annotate(semana=TruncWeek('fecha'))
              .values('semana')
              .annotate(count=Count('noDeServicio'))
              .order_by('semana')
        )
        tendencia_semanal = [
            {'semana': item['semana'].strftime('%d %b'), 'count': item['count']}
            for item in tendencia
        ]

        return Response({
            'total': total,
            'pendientes': pendientes,
            'completados': completados,
            'tasa_completado': tasa_completado,
            'por_estado': por_estado,
            'por_aparato': por_aparato,
            'por_marca': por_marca,
            'tendencia_semanal': tendencia_semanal,
        })