# apps/pedidos/urls.py

from django.urls import path
from . import views

app_name = 'pedidos'

urlpatterns = [
    path('', views.order_list, name='order_list'),  # Listar todos los pedidos
    path('create/', views.create_order, name='create_order'),  # Crear un nuevo pedido
    path('detail/<int:id>/', views.order_detail, name='order_detail'),  # Detalles de un pedido
    path('cancel/<int:id>/', views.cancel_order, name='cancel_order'),  # Cancelar un pedido
]
