from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncDate, TruncDay
from datetime import datetime
from django.utils import timezone
from datetime import timedelta
from apps.pedidos.pagination import PedidoPagination
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


class AllVentasView(viewsets.ViewSet):
    """
    Vista para obtener todas las ventas (refacciones, servicios y devoluciones)
    junto con estadísticas agregadas.
    """
    permission_classes = [permissions.IsAdminUser]
    pagination_class = PedidoPagination

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtiene estadísticas agregadas de ventas con filtros de fecha"""
        # Obtener parámetros
        tipo = request.query_params.get('tipo', 'mes')  # 'dia', 'mes', 'año'
        año = request.query_params.get('año', None)
        mes = request.query_params.get('mes', None)
        dia = request.query_params.get('dia', None)
        
        # Si no se especifica año/mes, usar el mes actual
        ahora = timezone.now()
        if not año:
            año = ahora.year
        else:
            año = int(año)
        
        if not mes:
            mes = ahora.month
        else:
            mes = int(mes)
        
        if not dia:
            dia = ahora.day
        else:
            dia = int(dia)
        
        # Construir filtros según el tipo
        if tipo == 'dia':
            # Estadísticas del día especificado
            fecha_inicio = timezone.make_aware(datetime(año, mes, dia))
            fecha_fin = fecha_inicio + timedelta(days=1) - timedelta(seconds=1)
        elif tipo == 'mes':
            # Estadísticas del mes especificado
            fecha_inicio = timezone.make_aware(datetime(año, mes, 1))
            if mes == 12:
                fecha_fin = timezone.make_aware(datetime(año + 1, 1, 1)) - timedelta(seconds=1)
            else:
                fecha_fin = timezone.make_aware(datetime(año, mes + 1, 1)) - timedelta(seconds=1)
        else:  # tipo == 'año'
            # Estadísticas del año especificado
            fecha_inicio = timezone.make_aware(datetime(año, 1, 1))
            fecha_fin = timezone.make_aware(datetime(año, 12, 31, 23, 59, 59))
        
        # Total de ventas de servicios
        total_ventas_servicios = VentasServicios.objects.filter(
            fecha_venta__gte=fecha_inicio,
            fecha_venta__lte=fecha_fin
        ).aggregate(
            total=Sum('total'),
            count=Count('id')
        )
        
        # Total de ventas de refacciones
        total_ventas_refacciones = Ventas.objects.filter(
            fecha_venta__gte=fecha_inicio,
            fecha_venta__lte=fecha_fin
        ).aggregate(
            total=Sum('total'),
            count=Count('id')
        )
        
        # Total de devoluciones
        total_devoluciones = Devolucion.objects.filter(
            fecha_devolucion__gte=fecha_inicio,
            fecha_devolucion__lte=fecha_fin
        ).aggregate(
            total=Sum('total'),
            count=Count('id')
        )
        
        return Response({
            'ventas_servicios': {
                'total': float(total_ventas_servicios['total'] or 0),
                'cantidad': total_ventas_servicios['count'] or 0
            },
            'ventas_refacciones': {
                'total': float(total_ventas_refacciones['total'] or 0),
                'cantidad': total_ventas_refacciones['count'] or 0
            },
            'devoluciones': {
                'total': float(total_devoluciones['total'] or 0),
                'cantidad': total_devoluciones['count'] or 0
            },
            'tipo': tipo,
            'año': año,
            'mes': mes if tipo != 'año' else None
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def grafico(self, request):
        """Obtiene datos para el gráfico de ventas por día (dentro de un mes) o por mes (dentro de un año)"""
        # Obtener parámetros
        tipo = request.query_params.get('tipo', 'dia')  # 'dia' o 'mes'
        año = request.query_params.get('año', None)
        mes = request.query_params.get('mes', None)
        
        # Si no se especifica año/mes, usar el mes actual
        ahora = timezone.now()
        if not año:
            año = ahora.year
        else:
            año = int(año)
        
        if not mes:
            mes = ahora.month
        else:
            mes = int(mes)
        
        if tipo == 'dia':
            # Vista por día dentro del mes especificado
            fecha_inicio = timezone.make_aware(datetime(año, mes, 1))
            # Calcular último día del mes
            if mes == 12:
                fecha_fin = timezone.make_aware(datetime(año + 1, 1, 1)) - timedelta(days=1)
            else:
                fecha_fin = timezone.make_aware(datetime(año, mes + 1, 1)) - timedelta(days=1)
            
            # Ventas de refacciones por día
            ventas_refacciones = Ventas.objects.filter(
                fecha_venta__gte=fecha_inicio,
                fecha_venta__lte=fecha_fin
            ).annotate(
                dia=TruncDay('fecha_venta')
            ).values('dia').annotate(
                total=Sum('total'),
                cantidad=Count('id')
            ).order_by('dia')
            
            # Ventas de servicios por día
            ventas_servicios = VentasServicios.objects.filter(
                fecha_venta__gte=fecha_inicio,
                fecha_venta__lte=fecha_fin
            ).annotate(
                dia=TruncDay('fecha_venta')
            ).values('dia').annotate(
                total=Sum('total'),
                cantidad=Count('id')
            ).order_by('dia')
            
            # Devoluciones por día
            devoluciones = Devolucion.objects.filter(
                fecha_devolucion__gte=fecha_inicio,
                fecha_devolucion__lte=fecha_fin
            ).annotate(
                dia=TruncDay('fecha_devolucion')
            ).values('dia').annotate(
                total=Sum('total'),
                cantidad=Count('id')
            ).order_by('dia')
            
            # Combinar datos por día
            datos_por_periodo = {}
            
            for item in ventas_refacciones:
                dia_key = item['dia'].strftime('%Y-%m-%d')
                if dia_key not in datos_por_periodo:
                    datos_por_periodo[dia_key] = {
                        'fecha': item['dia'].isoformat(),
                        'ventas_refacciones': 0,
                        'ventas_servicios': 0,
                        'devoluciones': 0,
                        'total': 0
                    }
                datos_por_periodo[dia_key]['ventas_refacciones'] = float(item['total'] or 0)
                datos_por_periodo[dia_key]['total'] += float(item['total'] or 0)
            
            for item in ventas_servicios:
                dia_key = item['dia'].strftime('%Y-%m-%d')
                if dia_key not in datos_por_periodo:
                    datos_por_periodo[dia_key] = {
                        'fecha': item['dia'].isoformat(),
                        'ventas_refacciones': 0,
                        'ventas_servicios': 0,
                        'devoluciones': 0,
                        'total': 0
                    }
                datos_por_periodo[dia_key]['ventas_servicios'] = float(item['total'] or 0)
                datos_por_periodo[dia_key]['total'] += float(item['total'] or 0)
            
            for item in devoluciones:
                dia_key = item['dia'].strftime('%Y-%m-%d')
                if dia_key not in datos_por_periodo:
                    datos_por_periodo[dia_key] = {
                        'fecha': item['dia'].isoformat(),
                        'ventas_refacciones': 0,
                        'ventas_servicios': 0,
                        'devoluciones': 0,
                        'total': 0
                    }
                datos_por_periodo[dia_key]['devoluciones'] = float(item['total'] or 0)
                datos_por_periodo[dia_key]['total'] -= float(item['total'] or 0)
            
            # Convertir a lista y ordenar
            resultado = sorted(datos_por_periodo.values(), key=lambda x: x['fecha'])
            
        else:
            # Vista por mes dentro del año especificado
            fecha_inicio = timezone.make_aware(datetime(año, 1, 1))
            fecha_fin = timezone.make_aware(datetime(año, 12, 31, 23, 59, 59))
            
            # Ventas de refacciones por mes
            ventas_refacciones = Ventas.objects.filter(
                fecha_venta__gte=fecha_inicio,
                fecha_venta__lte=fecha_fin
            ).annotate(
                mes=TruncMonth('fecha_venta')
            ).values('mes').annotate(
                total=Sum('total'),
                cantidad=Count('id')
            ).order_by('mes')
            
            # Ventas de servicios por mes
            ventas_servicios = VentasServicios.objects.filter(
                fecha_venta__gte=fecha_inicio,
                fecha_venta__lte=fecha_fin
            ).annotate(
                mes=TruncMonth('fecha_venta')
            ).values('mes').annotate(
                total=Sum('total'),
                cantidad=Count('id')
            ).order_by('mes')
            
            # Devoluciones por mes
            devoluciones = Devolucion.objects.filter(
                fecha_devolucion__gte=fecha_inicio,
                fecha_devolucion__lte=fecha_fin
            ).annotate(
                mes=TruncMonth('fecha_devolucion')
            ).values('mes').annotate(
                total=Sum('total'),
                cantidad=Count('id')
            ).order_by('mes')
            
            # Combinar datos por mes
            datos_por_periodo = {}
            
            for item in ventas_refacciones:
                mes_key = item['mes'].strftime('%Y-%m')
                if mes_key not in datos_por_periodo:
                    datos_por_periodo[mes_key] = {
                        'fecha': item['mes'].isoformat(),
                        'ventas_refacciones': 0,
                        'ventas_servicios': 0,
                        'devoluciones': 0,
                        'total': 0
                    }
                datos_por_periodo[mes_key]['ventas_refacciones'] = float(item['total'] or 0)
                datos_por_periodo[mes_key]['total'] += float(item['total'] or 0)
            
            for item in ventas_servicios:
                mes_key = item['mes'].strftime('%Y-%m')
                if mes_key not in datos_por_periodo:
                    datos_por_periodo[mes_key] = {
                        'fecha': item['mes'].isoformat(),
                        'ventas_refacciones': 0,
                        'ventas_servicios': 0,
                        'devoluciones': 0,
                        'total': 0
                    }
                datos_por_periodo[mes_key]['ventas_servicios'] = float(item['total'] or 0)
                datos_por_periodo[mes_key]['total'] += float(item['total'] or 0)
            
            for item in devoluciones:
                mes_key = item['mes'].strftime('%Y-%m')
                if mes_key not in datos_por_periodo:
                    datos_por_periodo[mes_key] = {
                        'fecha': item['mes'].isoformat(),
                        'ventas_refacciones': 0,
                        'ventas_servicios': 0,
                        'devoluciones': 0,
                        'total': 0
                    }
                datos_por_periodo[mes_key]['devoluciones'] = float(item['total'] or 0)
                datos_por_periodo[mes_key]['total'] -= float(item['total'] or 0)
            
            # Convertir a lista y ordenar
            resultado = sorted(datos_por_periodo.values(), key=lambda x: x['fecha'])
        
        return Response({
            'datos': resultado,
            'tipo': tipo,
            'año': año,
            'mes': mes if tipo == 'dia' else None
        }, status=status.HTTP_200_OK)

    def list(self, request):
        """Obtiene todas las ventas (refacciones, servicios y devoluciones) con paginación"""
        # Obtener parámetros de filtro
        tipo_filter = request.query_params.get('tipo', None)
        search = request.query_params.get('search', None)
        
        # Obtener ventas de refacciones
        ventas_refacciones_qs = Ventas.objects.select_related('usuario', 'marca', 'refaccion').all()
        if tipo_filter and tipo_filter != 'refaccion':
            ventas_refacciones_qs = ventas_refacciones_qs.none()
        ventas_refacciones_data = VentasSerializer(ventas_refacciones_qs, many=True).data
        
        # Obtener ventas de servicios
        ventas_servicios_qs = VentasServicios.objects.select_related('servicio').all()
        if tipo_filter and tipo_filter != 'servicio':
            ventas_servicios_qs = ventas_servicios_qs.none()
        ventas_servicios_data = VentasServiciosSerializer(ventas_servicios_qs, many=True).data
        
        # Obtener devoluciones
        devoluciones_qs = Devolucion.objects.select_related('venta', 'marca', 'refaccion').all()
        if tipo_filter and tipo_filter != 'devolucion':
            devoluciones_qs = devoluciones_qs.none()
        devoluciones_data = DevolucionSerializer(devoluciones_qs, many=True).data
        
        # Combinar y ordenar por fecha
        todas_las_ventas = []
        
        # Agregar ventas de refacciones con tipo
        for venta in ventas_refacciones_data:
            todas_las_ventas.append({
                **venta,
                'tipo': 'refaccion',
                'fecha': venta['fecha_venta']
            })
        
        # Agregar ventas de servicios con tipo
        for venta in ventas_servicios_data:
            todas_las_ventas.append({
                **venta,
                'tipo': 'servicio',
                'fecha': venta['fecha_venta']
            })
        
        # Agregar devoluciones con tipo
        for devolucion in devoluciones_data:
            todas_las_ventas.append({
                **devolucion,
                'tipo': 'devolucion',
                'fecha': devolucion['fecha_devolucion']
            })
        
        # Aplicar búsqueda si existe
        if search:
            search_lower = search.lower()
            todas_las_ventas = [
                v for v in todas_las_ventas
                if (
                    search_lower in (v.get('refaccion_nombre', '') or '').lower() or
                    search_lower in (v.get('marca_nombre', '') or '').lower() or
                    search_lower in (v.get('servicio_aparato', '') or '').lower() or
                    search_lower in (v.get('tecnico', '') or '').lower() or
                    search_lower in str(v.get('id', '')).lower()
                )
            ]
        
        # Ordenar por fecha descendente
        todas_las_ventas.sort(key=lambda x: x['fecha'], reverse=True)
        
        # Aplicar paginación
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(todas_las_ventas, request)
        
        if page is not None:
            return paginator.get_paginated_response(page)
        
        return Response({
            'results': todas_las_ventas,
            'count': len(todas_las_ventas)
        }, status=status.HTTP_200_OK)