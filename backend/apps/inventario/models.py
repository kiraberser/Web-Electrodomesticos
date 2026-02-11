from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from django.core.exceptions import ValidationError
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
    fecha = models.DateTimeField(auto_now_add=True)
    observaciones = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.refaccion} - {self.tipo_movimiento} - {self.cantidad}"

    def clean(self):
        if self.cantidad is None or self.cantidad <= 0:
            raise ValidationError("La cantidad debe ser mayor a cero.")
        if self.tipo_movimiento == self.TipoMovimientoChoices.SALIDA and self.refaccion_id:
            # Validación preventiva de stock
            if self.cantidad > self.refaccion.existencias:
                raise ValidationError("Stock insuficiente para la salida.")

    def save(self, *args, **kwargs):
        # Asegura validaciones de dominio antes de persistir
        self.full_clean()
        return super().save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=['refaccion', 'fecha'])
        ]

@receiver(post_save, sender=Inventario)
def post_save_receiver(sender, instance, created, **kwargs):
    if not created:
        return
    delta = instance.cantidad if instance.tipo_movimiento == Inventario.TipoMovimientoChoices.ENTRADA else -instance.cantidad
    # Actualización atómica para evitar condiciones de carrera
    Refaccion.objects.filter(pk=instance.refaccion_id).update(existencias=F('existencias') + delta)

