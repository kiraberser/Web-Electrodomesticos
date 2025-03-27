from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.conf import settings

class Blog(models.Model):
    class Category(models.TextChoices):
        MOTOR = "Motor", "Motor"
        MINISPLIT = "Minisplit", "Minisplit"
        LAVADORA = "Lavadora", "Lavadora"
        VENTILADOR = "Ventilador", "Ventilador"
        SECADORA = "Secadora", "Secadora"
        REFRIGERADOR = "Refrigerador", "Refrigerador"
        ESTUFA = "Estufa", "Estufa"
        HORNO = "Horno", "Horno"
        MICROONDAS = "Microondas", "Microondas"
        LICUADORA = "Licuadora", "Licuadora"
        BATIDORA = "Batidora", "Batidora"
        TOSTADOR = "Tostador", "Tostador"
        CAFETERA = "Cafetera", "Cafetera"
        PLANCHA = "Plancha", "Plancha"
        ASPIRADORA = "Aspiradora", "Aspiradora"
        OTROS = "Otros", "Otros"

    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        default=1
    )
    slug = models.SlugField(unique=True, blank=True)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.OTROS)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)  # Genera el slug a partir del título
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('blogdetail', kwargs={'slug': self.slug})

    def __str__(self):  # Método mágico __str__
        return self.title
