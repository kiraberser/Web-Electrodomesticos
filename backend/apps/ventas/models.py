from django.db import models
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from apps.productos.models import Marca, Refaccion
from apps.servicios.models import Servicio

# Create your models here.
class Ventas(models.Model):
    """"Modelo para registrar ventas de refacciones"""
    id = models.AutoField(primary_key=True, verbose_name="ID de Venta")
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='ventas_refacciones',
        null=True,
        blank=True,
    )
    marca = models.ForeignKey(
        Marca, 
        on_delete=models.CASCADE, 
        related_name='ventas', 
        verbose_name="Marca"
    )
    refaccion = models.ForeignKey(
        Refaccion,
        on_delete=models.CASCADE,
        related_name='ventas',
        verbose_name="Refacción"
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(
        max_digits=10, 
        decimal_places=2
    )
    total = models.DecimalField(
        max_digits=10, 
        decimal_places=2
    )
    fecha_venta = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Venta"
        verbose_name_plural = "Ventas"
        ordering = ['-fecha_venta']
        
    def __str__(self):
        return f"Venta {self.id} - {self.refaccion.nombre} ({self.cantidad})"
    
    
    
class VentasServicios(models.Model):
    ESTADO_PAGO_CHOICES = (
        ("Pendiente", "Pendiente"),
        ("Parcial", "Parcial"),
        ("Pagado", "Pagado"),
    )

    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='ventas_servicios')
    # Cost breakdown
    mano_obra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    refacciones_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # Meta info
    fecha_venta = models.DateTimeField(auto_now_add=True)
    observaciones = models.TextField(blank=True, null=True, max_length=500)
    tecnico = models.CharField(max_length=100, blank=True, null=True)
    garantia_dias = models.PositiveIntegerField(default=30)
    estado_pago = models.CharField(max_length=20, choices=ESTADO_PAGO_CHOICES, default="Pendiente")

    class Meta:
        verbose_name = "Venta de Servicio"
        verbose_name_plural = "Ventas de Servicios"
        ordering = ['-fecha_venta']

    def __str__(self):
        return f"Venta servicio #{self.servicio_id} - Total {self.total}"


class Devolucion(models.Model):
    """Modelo para registrar devoluciones de refacciones"""
    id = models.AutoField(primary_key=True, verbose_name="ID de Devolución")
    venta = models.ForeignKey(
        Ventas,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='devoluciones',
        verbose_name="Venta relacionada"
    )
    marca = models.ForeignKey(
        Marca,
        on_delete=models.CASCADE,
        related_name='devoluciones',
        verbose_name="Marca"
    )
    refaccion = models.ForeignKey(
        Refaccion,
        on_delete=models.CASCADE,
        related_name='devoluciones',
        verbose_name="Refacción"
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    motivo = models.TextField(blank=True, null=True, max_length=500)
    fecha_devolucion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Devolución"
        verbose_name_plural = "Devoluciones"
        ordering = ['-fecha_devolucion']

    def __str__(self):
        return f"Devolución {self.id} - {self.refaccion.nombre} ({self.cantidad})"