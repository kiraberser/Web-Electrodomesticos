from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Pago(models.Model):
    """Modelo para almacenar información de pagos de Mercado Pago"""
    
    class EstadoChoices(models.TextChoices):
        PENDIENTE = 'PEN', _('Pendiente')
        APROBADO = 'APR', _('Aprobado')
        RECHAZADO = 'REC', _('Rechazado')
        CANCELADO = 'CAN', _('Cancelado')
        REEMBOLSADO = 'REE', _('Reembolsado')
    
    id = models.AutoField(primary_key=True)
    pedido = models.OneToOneField(
        'pedidos.Pedido',
        on_delete=models.PROTECT,
        related_name='pago',
        null=True,
        blank=True
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='pagos'
    )
    
    # Información de Mercado Pago
    preference_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    payment_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    status = models.CharField(max_length=3, choices=EstadoChoices.choices, default=EstadoChoices.PENDIENTE)
    status_detail = models.CharField(max_length=255, null=True, blank=True)
    
    # Información financiera
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='MXN')
    
    # Información adicional de Mercado Pago
    payment_method_id = models.CharField(max_length=50, null=True, blank=True)
    payment_type_id = models.CharField(max_length=50, null=True, blank=True)
    
    # Metadatos
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_aprobacion = models.DateTimeField(null=True, blank=True)
    
    # Datos JSON completos de Mercado Pago (para referencia)
    mp_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-fecha_creacion']
        indexes = [
            models.Index(fields=['preference_id']),
            models.Index(fields=['payment_id']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Pago {self.id} - {self.get_status_display()} - ${self.amount}"
