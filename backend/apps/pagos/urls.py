# apps/pagos/urls.py

from django.urls import path
from . import views

app_name = 'pagos'

urlpatterns = [
    # path('', views.payment_methods, name='payment_methods'),  # Métodos de pago disponibles
    # path('process/', views.process_payment, name='process_payment'),  # Procesar un pago
    # path('status/', views.payment_status, name='payment_status'),  # Ver el estado de un pago
]
