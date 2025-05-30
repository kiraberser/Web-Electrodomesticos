from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _

class Marca(models.Model):
    """Modelo para registrar marcas de electrodomésticos"""
    nombre = models.CharField(max_length=100, unique=True)
    pais_origen = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Marcas"

class Categoria(models.Model):
    """Categorías de electrodomésticos"""
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Categorías"

class Refaccion(models.Model):
    """Modelo principal para refacciones de electrodomésticos"""
    class EstadoChoices(models.TextChoices):
        NUEVO = 'NVO', _('Nuevo')
        USADO_BUEN_ESTADO = 'UBS', _('Usado - Buen Estado')
        REACONDICIONADO = 'REC', _('Reacondicionado')

    codigo_parte = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    marca = models.ForeignKey(Marca, on_delete=models.PROTECT, related_name='refacciones')
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='refacciones')
    
    precio = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)]
    )
    existencias = models.PositiveIntegerField(default=0)
    estado = models.CharField(
        max_length=3, 
        choices=EstadoChoices.choices, 
        default=EstadoChoices.NUEVO
    )
    
    compatibilidad = models.TextField(help_text="Modelos de electrodomésticos compatibles")
    
    fecha_ingreso = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - {self.codigo_parte}"

    class Meta:
        verbose_name = "Refacción"
        verbose_name_plural = "Refacciones"
        ordering = ['-fecha_ingreso']

class Proveedor(models.Model):
    """Modelo para gestionar proveedores de refacciones"""
    nombre = models.CharField(max_length=200)
    contacto = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo_electronico = models.EmailField(unique=True)
    direccion = models.TextField()

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Proveedores"
