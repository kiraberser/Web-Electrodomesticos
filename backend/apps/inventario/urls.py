from django.urls import path, include
from .views import InventarioViewSet

urlpatterns = [
    path('', include([
        path('refacciones/', InventarioViewSet.as_view({'get': 'list', 'post': 'create'}), name='inventario-list'),
        path('refaccion/<int:pk>/', InventarioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='inventario-detail'),
        path('salida/', InventarioViewSet.as_view({'post': 'registrar_salida'}), name='inventario-salida'),
        path('entrada/', InventarioViewSet.as_view({'post': 'registrar_entrada'}), name='inventario-entrada'),
        path('devolucion/', InventarioViewSet.as_view({'post': 'registrar_devolucion'}), name='inventario-devolucion'),
    ])),
]
