# apps/pedidos/urls.py

from django.urls import path
from .views import CheckoutView, MisPedidosView, AllPedidosView, UpdatePedidoEstadoView

app_name = 'pedidos'

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('mis-pedidos/', MisPedidosView.as_view(), name='mis_pedidos'),
    path('all/', AllPedidosView.as_view(), name='all_pedidos'),
    path('<int:pedido_id>/update-estado/', UpdatePedidoEstadoView.as_view(), name='update_estado'),
]
