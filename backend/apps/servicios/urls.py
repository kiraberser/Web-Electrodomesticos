from rest_framework.routers import DefaultRouter
from .views import ServicioViewSet, ServicioReparadoViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('servicios', ServicioViewSet, basename='servicio')
router.register('reparados', ServicioReparadoViewSet, basename='reparado')

urlpatterns = [
    path('', include(router.urls)),
]
