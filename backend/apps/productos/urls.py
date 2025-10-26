from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MarcaViewSet, 
    CategoriaViewSet, 
    RefaccionViewSet, 
    ProveedorViewSet,
    refacciones_por_categoria,
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
    
    # URLs personalizadas para funcionalidades específicas
    # Obtener refacciones (productos) por categoría
    path('categorias/<int:categoria_id>/refacciones/', refacciones_por_categoria, name='refacciones-por-categoria'),
]