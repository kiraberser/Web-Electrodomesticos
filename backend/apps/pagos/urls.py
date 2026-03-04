# apps/pagos/urls.py

from django.urls import path
from . import views

app_name = 'pagos'

urlpatterns = [
    path('crear-preferencia/', views.CrearPreferenciaPagoView.as_view(), name='crear_preferencia'),
    path('procesar-card/', views.ProcesarPagoCardView.as_view(), name='procesar_card'),
    path('procesar-efectivo/', views.ProcesarPagoEfectivoView.as_view(), name='procesar_efectivo'),
    # Atomic checkout endpoints (create order + payment in one step)
    path('checkout-card/', views.CheckoutCardView.as_view(), name='checkout_card'),
    path('checkout-efectivo/', views.CheckoutEfectivoView.as_view(), name='checkout_efectivo'),
    path('webhook/', views.WebhookView.as_view(), name='webhook'),
    path('<int:pago_id>/', views.ConsultarPagoView.as_view(), name='consultar_pago'),
]
