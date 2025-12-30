from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    # Campos adicionales personalizados
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Campos de dirección estructurados
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
    
    def get_full_address(self):
        """Retorna la dirección completa formateada"""
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