from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VentasViewSet, VentasServiciosViewSet, DevolucionViewSet

# Crear un router y registrar el ViewSet de Ventas
router = DefaultRouter()

router.register(r'registros-ventas', VentasViewSet, basename='ventas')
router.register(r'registros-servicios', VentasServiciosViewSet, basename='ventas_servicios')
router.register(r'devoluciones', DevolucionViewSet, basename='devoluciones')
# Definir las URLs del módulo de ventas
urlpatterns = [
    path('', include(router.urls)),
    
]