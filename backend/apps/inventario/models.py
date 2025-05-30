from django.db import models
from apps.productos.models import Refaccion, Proveedor

# Create your models here.

class Inventario(models.Model):
    """Registro de movimientos de inventario"""
    class TipoMovimientoChoices(models.TextChoices):                                            
        ENTRADA = 'ENT', ('Entrada')
        SALIDA = 'SAL', ('Salida')

    refaccion = models.ForeignKey(Refaccion, on_delete=models.CASCADE, related_name='movimientos')
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, blank=True)
    cantidad = models.PositiveIntegerField()
    tipo_movimiento = models.CharField(
        max_length=3, 
        choices=TipoMovimientoChoices.choices
    )
    fecha = models.DateTimeField(auto_now_add=True)
    observaciones = models.TextField(blank=True)

    def __str__(self):
        return f"{self.refaccion} - {self.tipo_movimiento} - {self.cantidad}"

    class Meta:
        verbose_name = "Movimiento de Inventario"
        verbose_name_plural = "Movimientos de Inventario"
        ordering = ['-fecha']