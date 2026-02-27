from .views import ServicioViewSet, ServiciosEntregadosView, ServiciosReparadosView, EstadisticasServiciosView
from django.urls import path

urlpatterns = [
    path('', ServicioViewSet.as_view({'get': 'list'}), name='servicio-list'),
    path('nuevo/', ServicioViewSet.as_view({'post': 'create'}), name='servicio-create'),
    path('estadisticas/', EstadisticasServiciosView.as_view(), name='servicios-estadisticas'),
    path('entregados/', ServiciosEntregadosView.as_view(), name='servicios-entregados'),
    path('reparados/', ServiciosReparadosView.as_view(), name='servicios-reparados'),
    path('<int:pk>/', ServicioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy', 'patch': 'partial_update'}), name='servicio-detail'),
]
