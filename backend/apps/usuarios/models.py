from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError

class Usuario(AbstractUser):
    # Campos adicionales personalizados
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Campos de dirección estructurados (DEPRECADOS - usar modelo Direccion)
    # Estos campos se mantienen solo para compatibilidad con datos existentes
    # La dirección principal se obtiene desde Direccion.is_primary=True
    address_street = models.CharField(max_length=255, blank=True, null=True, verbose_name="Calle y número")
    address_colony = models.CharField(max_length=255, blank=True, null=True, verbose_name="Colonia")
    address_city = models.CharField(max_length=100, blank=True, null=True, verbose_name="Ciudad")
    address_state = models.CharField(max_length=100, blank=True, null=True, verbose_name="Estado")
    address_postal_code = models.CharField(max_length=10, blank=True, null=True, verbose_name="Código Postal")
    address_references = models.TextField(blank=True, null=True, verbose_name="Referencias adicionales")
    
    # Campo legacy para compatibilidad (se puede eliminar después de migrar datos)
    address = models.CharField(max_length=255, blank=True, null=True)
    
    # Puedes agregar más campos según necesites
    def __str__(self):
        return self.username
    
    def get_primary_address(self):
        """Obtiene la dirección principal del usuario desde el modelo Direccion"""
        return self.direcciones.filter(is_primary=True).first()
    
    def get_full_address(self):
        """Retorna la dirección completa formateada desde Direccion principal o campos legacy"""
        # Primero intentar obtener desde Direccion (nuevo sistema)
        primary_address = self.get_primary_address()
        if primary_address:
            return primary_address.get_full_address()
        
        # Fallback a campos legacy (para compatibilidad)
        parts = []
        if self.address_street:
            parts.append(self.address_street)
        if self.address_colony:
            parts.append(self.address_colony)
        if self.address_city:
            parts.append(self.address_city)
        if self.address_state:
            parts.append(self.address_state)
        if self.address_postal_code:
            parts.append(f"CP: {self.address_postal_code}")
        return ", ".join(parts) if parts else None


class Direccion(models.Model):
    """Modelo para direcciones de envío de usuarios"""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='direcciones')
    nombre = models.CharField(max_length=100, verbose_name="Nombre de la dirección")
    street = models.CharField(max_length=255, verbose_name="Calle y número")
    colony = models.CharField(max_length=255, verbose_name="Colonia")
    city = models.CharField(max_length=100, verbose_name="Ciudad")
    state = models.CharField(max_length=100, verbose_name="Estado")
    postal_code = models.CharField(max_length=10, verbose_name="Código Postal")
    references = models.TextField(blank=True, null=True, verbose_name="Referencias adicionales")
    is_primary = models.BooleanField(default=False, verbose_name="Dirección principal")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        return f"{self.nombre} - {self.usuario.username}"
    
    def clean(self):
        """Validar que no haya más de 3 direcciones por usuario"""
        if not self.pk:  # Solo validar en creación
            if Direccion.objects.filter(usuario=self.usuario).count() >= 3:
                raise ValidationError("No puedes tener más de 3 direcciones de envío")
    
    def save(self, *args, **kwargs):
        """Asegurar que solo haya una dirección principal"""
        if self.is_primary:
            # Desmarcar otras direcciones principales del mismo usuario
            Direccion.objects.filter(usuario=self.usuario, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        self.full_clean()
        super().save(*args, **kwargs)
    
    def get_full_address(self):
        """Retorna la dirección completa formateada"""
        parts = []
        if self.street:
            parts.append(self.street)
        if self.colony:
            parts.append(self.colony)
        if self.city:
            parts.append(self.city)
        if self.state:
            parts.append(self.state)
        if self.postal_code:
            parts.append(f"CP: {self.postal_code}")
        return ", ".join(parts) if parts else ""