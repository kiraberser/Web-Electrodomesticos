# apps/pagos/urls.py

from django.urls import path
from . import views

app_name = 'pagos'

urlpatterns = [
    path('crear-preferencia/', views.CrearPreferenciaPagoView.as_view(), name='crear_preferencia'),
    path('webhook/', views.WebhookView.as_view(), name='webhook'),
    path('<int:pago_id>/', views.ConsultarPagoView.as_view(), name='consultar_pago'),
]
