from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.conf import settings

from taggit.managers import TaggableManager

class Category(models.TextChoices):
        MOTOR = "Motor", "Motor"
        MINISPLIT = "Minisplit", "Minisplit"
        LAVADORA = "Lavadora", "Lavadora"
        VENTILADOR = "Ventilador", "Ventilador"
        REFRIGERADOR = "Refrigerador", "Refrigerador"
        ESTUFA = "Estufa", "Estufa"
        MICROONDAS = "Microondas", "Microondas"
        LICUADORA = "Licuadora", "Licuadora"
        CAFETERA = "Cafetera", "Cafetera"
        PLANCHA = "Plancha", "Plancha"
        ASPIRADORA = "Aspiradora", "Aspiradora"
        PULIDORA = "Pulidora", "Pulidora"
        BOMBADEAGUA = 'Bombas de agua', 'Bombas de agua'
        TALADROS = 'Taladro', 'Taladro'
        OTROS = "Otros", "Otros"

class Blog(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.TextField(blank=True, null=True)
    resume = models.TextField(blank=True, null=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        default=1
    )
    slug = models.SlugField(unique=True, blank=True, unique_for_date='created_at')
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.OTROS)
    tags = TaggableManager()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)  # Genera el slug a partir del título
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('postdetail', kwargs={'slug': self.slug})

    def __str__(self):  # Método mágico __str__
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Blog, 
                            on_delete=models.CASCADE, 
                            related_name='comments')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    active = models.BooleanField(default=True)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f'Comment by {self.author} on {self.blog.title}'