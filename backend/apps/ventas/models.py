from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class Ventas(models.Model):
    """"Modelo para registrar ventas de refacciones"""
    id = models.AutoField(primary_key=True, verbose_name="ID de Venta")
    marca = models.CharField(
        max_length=100, 
        blank=True, 
        null=True
    )
    refaccion = models.ForeignKey(
        'productos.Refaccion', 
        on_delete=models.CASCADE, 
        related_name='ventas'
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
