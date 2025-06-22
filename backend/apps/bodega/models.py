from django.db import models

# Create your models here.
class Bodega(models.Model):
    noDeServicio = models.IntegerField(primary_key=True)
    aparato = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Bodegas"
        ordering = ['name']