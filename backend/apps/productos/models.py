from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from decimal import Decimal

class Marca(models.Model):
    """Modelo para registrar marcas de electrodomésticos"""
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    pais_origen = models.CharField(max_length=100, blank=True, null=True)
    logo = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Marcas"

class Categoria(models.Model):
    """Categorías de electrodomésticos"""
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    imagen = models.URLField(blank=True, null=True)

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

    id = models.AutoField(primary_key=True)
    codigo_parte = models.CharField(max_length=50, unique=True)
    proveedor = models.ForeignKey('Proveedor', on_delete=models.PROTECT, related_name='refacciones', null=True, blank=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    marca = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='refacciones')
    imagen = models.URLField(blank=True, null=True)
    precio = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0'))]
    )
    existencias = models.PositiveIntegerField(default=0)
    estado = models.CharField(
        max_length=3, 
        choices=EstadoChoices.choices, 
        default=EstadoChoices.NUEVO
    )
    
    compatibilidad = models.TextField(help_text="Modelos de electrodomésticos compatibles")
    ubicacion_estante = models.CharField(max_length=50, blank=True, null=True, help_text="Numero de estante/anaquel")

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
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    contacto = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo_electronico = models.EmailField(unique=True)
    direccion = models.TextField()
    logo = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Proveedores"


class ComentarioProducto(models.Model):
    """Modelo para comentarios/opiniones de productos"""
    refaccion = models.ForeignKey(
        Refaccion,
        on_delete=models.CASCADE,
        related_name='comentarios'
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comentarios_productos'
    )
    calificacion = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Calificación de 1 a 5 estrellas"
    )
    comentario = models.TextField()
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Comentario de Producto"
        verbose_name_plural = "Comentarios de Productos"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['refaccion', '-created_at']),
        ]
        # Evitar comentarios duplicados del mismo usuario para el mismo producto
        unique_together = [['refaccion', 'usuario']]

    def __str__(self):
        return f'Comentario de {self.usuario.username} en {self.refaccion.nombre}'

# La lógica de creación de movimiento inicial se movió a un servicio
