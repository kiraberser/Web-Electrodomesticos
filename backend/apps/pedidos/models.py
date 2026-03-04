from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from apps.productos.models import Refaccion


class Pedido(models.Model):
    class EstadoChoices(models.TextChoices):
        CREADO = 'CRE', _('Creado')
        PAGADO = 'PAG', _('Pagado')
        ENVIADO = 'ENV', _('Enviado')
        ENTREGADO = 'ENT', _('Entregado')
        CANCELADO = 'CAN', _('Cancelado')

    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='pedidos',
        null=True,
        blank=True,
    )
    estado = models.CharField(max_length=3, choices=EstadoChoices.choices, default=EstadoChoices.CREADO)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    numero_seguimiento = models.CharField(max_length=100, blank=True, null=True, verbose_name="Número de seguimiento")

    # Guest checkout fields
    guest_name = models.CharField(max_length=150, blank=True, null=True)
    guest_email = models.EmailField(blank=True, null=True)
    guest_phone = models.CharField(max_length=30, blank=True, null=True)
    direccion_snapshot = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-fecha_creacion']

    def __str__(self):
        if self.usuario:
            return f"Pedido {self.id} - {self.usuario} - {self.estado}"
        return f"Pedido {self.id} (invitado: {self.guest_email}) - {self.estado}"


class PedidoItem(models.Model):
    id = models.AutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    refaccion = models.ForeignKey(Refaccion, on_delete=models.PROTECT, related_name='pedido_items')
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Item {self.refaccion} x{self.cantidad}"
