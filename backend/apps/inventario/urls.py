from django.urls import path, include
from .views import InventarioViewSet

urlpatterns = [
    path('', include([
        path('refacciones/', InventarioViewSet.as_view({'get': 'list'}), name='inventario-list'),
        path('refaccion/<int:pk>/', InventarioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='inventario-detail'),
    ])),
]
