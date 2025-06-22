from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

# Create your models here.
class Servicio(models.Model):
    noDeServicio = models.AutoField(primary_key=True)
    fecha = models.DateField(auto_now_add=True)
    marca = models.CharField(max_length=100)
    aparato = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    cliente = models.CharField(max_length=100)
    observaciones = models.TextField(blank=True, null=True, max_length=500)
    estado = models.CharField(max_length=50, choices=[
        ('Pendiente', 'Pendiente'),
        ('Completado', 'Reparado'),
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
    

#Cuando el servicio tenga el estado Entregado, se debe crear un registro en la tabla ServiciosReparados
#Se filtraran los datos y cuando el servicio tenga el estado Entregado, aparecerá un modal donde se podrá seleccionar el costo y el precio del servicio

class ServicioReparado(models.Model):
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='reparados')
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    precio = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0.00)
    fecha_reparacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.servicio.aparato} - {self.precio}"

    class Meta:
        verbose_name = "Servicio Reparado"
        verbose_name_plural = "Servicios Reparados"
        constraints = [
            models.UniqueConstraint(fields=['servicio'], name='unico_servicio_reparado')
        ]

