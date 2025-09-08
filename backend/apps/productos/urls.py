from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MarcaViewSet, 
    CategoriaViewSet, 
    RefaccionViewSet, 
    ProveedorViewSet
)

# Crear un router para manejar automáticamente las URLs de los ViewSets
router = DefaultRouter()
router.register(r'marcas', MarcaViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'refacciones', RefaccionViewSet)
router.register(r'proveedores', ProveedorViewSet)

urlpatterns = [ 
    # Las URLs base que manejan los ViewSets
    path('', include(router.urls)),
    
    # Ejemplos de URLs personalizadas (opcional)
    # path('refacciones/por-marca/<int:marca_id>/', RefaccionesPorMarcaView.as_view(), name='refacciones-por-marca'),
    # path('inventario/movimientos-recientes/', MovimientosRecentesView.as_view(), name='movimientos-recientes'),
]