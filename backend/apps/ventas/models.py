from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from apps.productos.models import Marca, Refaccion
from apps.servicios.models import Servicio

# Create your models here.
class Ventas(models.Model):
    """"Modelo para registrar ventas de refacciones"""
    id = models.AutoField(primary_key=True, verbose_name="ID de Venta")
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
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='ventas_servicios')
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    observaciones = models.TextField(blank=True, null=True, max_length=500)

    class Meta:
        verbose_name = "Venta de Servicio"
        verbose_name_plural = "Ventas de Servicios"
        ordering = ['-fecha_venta']

    def __str__(self):
        return f"Venta de {self.servicio.aparato} ({self.cantidad})"