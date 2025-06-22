from rest_framework.routers import DefaultRouter
from .views import BodegaViewSet

from django.urls import path, include

urlpatterns = [
    path('', BodegaViewSet.as_view({'get': 'list', 'post': 'create'}), name='bodega-list'),
    path('<int:pk>/', BodegaViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='bodega-detail'),
]
