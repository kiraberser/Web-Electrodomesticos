from django.db import models
from apps.productos.models import Refaccion
from django.utils.translation import gettext_lazy as _

class Inventario(models.Model):
    """Registro de movimientos de inventario"""

    class TipoMovimientoChoices(models.TextChoices):
        ENTRADA = 'ENT', _('Entrada')
        SALIDA = 'SAL', _('Salida')

    refaccion = models.ForeignKey(Refaccion, on_delete=models.CASCADE, related_name='movimientos')
    marca = models.CharField(max_length=100, blank=True, null=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cantidad = models.PositiveIntegerField()
    tipo_movimiento = models.CharField(
        max_length=3,
        choices=TipoMovimientoChoices.choices
    )
    fecha = models.DateTimeField(auto_now_add=True)  # <- esto estaba faltando para que ordering funcione

    def __str__(self):
        return f"{self.refaccion} - {self.tipo_movimiento} - {self.cantidad}"

    class Meta:
        verbose_name = "Movimiento de Inventario"
        verbose_name_plural = "Movimientos de Inventario"
        ordering = ['-fecha']
