from django.urls import path, include
from .views import InventarioViewSet

urlpatterns = [
    path('', include([
        path('total/', InventarioViewSet.as_view({'get': 'list', 'post': 'create'}), name='inventario-list'),
        path('producto/<int:pk>/', InventarioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='inventario-detail'),
    ])),
]
