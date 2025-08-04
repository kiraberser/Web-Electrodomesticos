from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.productos.models import Refaccion, Marca, Categoria

class Inventario(models.Model):
    """Registro de movimientos de inventario"""

    class TipoMovimientoChoices(models.TextChoices):
        ENTRADA = 'ENT', _('Entrada')
        SALIDA = 'SAL', _('Salida')

    id = models.AutoField(primary_key=True)
    refaccion = models.ForeignKey(Refaccion, on_delete=models.CASCADE, related_name='movimientos')
    marca = models.ForeignKey(Marca, on_delete=models.PROTECT, related_name='movimientos', null=True, blank=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cantidad = models.PositiveIntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='movimientos', null=True, blank=True)
    tipo_movimiento = models.CharField(
        max_length=3,
        choices=TipoMovimientoChoices.choices
    )
    fecha = models.DateTimeField(auto_now_add=True)  # <- esto estaba faltando para que ordering funcione

    def __str__(self):
        return f"{self.refaccion} - {self.tipo_movimiento} - {self.cantidad}"

@receiver(post_save, sender=Inventario)
def post_save_receiver(sender, instance, created, **kwargs):
    if created:
        refaccion = instance.refaccion
        if instance.tipo_movimiento == Inventario.TipoMovimientoChoices.ENTRADA:
            refaccion.existencias += instance.cantidad
        else:
            refaccion.existencias -= instance.cantidad
        refaccion.save()

