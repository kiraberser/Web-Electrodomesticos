from rest_framework.routers import DefaultRouter
from .views import ServicioViewSet, ServiciosEntregadosView, ServiciosReparadosView
from django.urls import path, include

urlpatterns = [
    path('', ServicioViewSet.as_view({'get': 'list'}), name='servicio-list'),
    path('nuevo/', ServicioViewSet.as_view({'post': 'create'}), name='servicio-create'),
    path('<int:pk>/', ServicioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='servicio-detail'),
    path('entregados/', ServiciosEntregadosView.as_view(), name='servicios-entregados'),
    path('reparados/', ServiciosReparadosView.as_view(), name='servicios-reparados'),
]
