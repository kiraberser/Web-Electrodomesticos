# apps/pedidos/urls.py

from django.urls import path
from .views import CheckoutView, MisPedidosView

app_name = 'pedidos'

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('mis-pedidos/', MisPedidosView.as_view(), name='mis_pedidos'),
]
