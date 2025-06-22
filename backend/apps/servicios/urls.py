from rest_framework.routers import DefaultRouter
from .views import ServicioViewSet, ServicioReparadoViewSet, ServiciosEntregadosView
from django.urls import path, include



urlpatterns = [
    path('', ServicioViewSet.as_view({'get': 'list'}), name='servicio-list'),
    path('nuevo/', ServicioViewSet.as_view({'post': 'create'}), name='servicio-create'),
    path('<int:pk>/', ServicioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='servicio-detail'),
    path('reparados/', ServicioReparadoViewSet.as_view({'get': 'list'}), name='servicio-reparado-list'),
    path('reparados/<int:pk>/', ServicioReparadoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='servicio-reparado-detail'),
    path('entregados/', ServiciosEntregadosView.as_view(), name='servicio-entregados'),
    path('entregados/<int:pk>/', ServicioReparadoViewSet.as_view({ 'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='servicio-entregado-detail'),
]   
