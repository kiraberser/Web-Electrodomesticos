from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

from apps.productos.models import Marca

# Create your models here.
class Servicio(models.Model):
    noDeServicio = models.AutoField(primary_key=True)
    fecha = models.DateField(auto_now_add=True)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, related_name='servicios')
    aparato = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    cliente = models.CharField(max_length=100)
    observaciones = models.TextField(blank=True, null=True, max_length=500)
    estado = models.CharField(max_length=50, choices=[
        ('Pendiente', 'Pendiente'),
        ('Reparado', 'Reparado'),
        ('Entregado', 'Entregado'),
        ('Revision', 'Revision'),
        ('En Bodega', 'En Bodega'),
    ], default='Pendiente')
    
    def __str__(self):
        return "Servicio No. {} - {} - {}".format(self.noDeServicio, self.aparato, self.estado)

    class Meta:
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"
        ordering = ['-noDeServicio']  # Ordenar por noDeServicio de forma descendente
    

