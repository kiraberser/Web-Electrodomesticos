from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VentasViewSet, VentasServiciosViewSet, DevolucionViewSet, AllVentasView

# Crear un router y registrar el ViewSet de Ventas
router = DefaultRouter()

router.register(r'registros-ventas', VentasViewSet, basename='ventas')
router.register(r'registros-servicios', VentasServiciosViewSet, basename='ventas_servicios')
router.register(r'devoluciones', DevolucionViewSet, basename='devoluciones')
router.register(r'all', AllVentasView, basename='all_ventas')

# Definir las URLs del módulo de ventas
urlpatterns = [
    path('', include(router.urls)),
]