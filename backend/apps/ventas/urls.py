from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VentasViewSet

# Crear un router y registrar el ViewSet de Ventas
router = DefaultRouter()

router.register(r'registros', VentasViewSet, basename='ventas')
# Definir las URLs del módulo de ventas
urlpatterns = [
    path('', include(router.urls)),
]