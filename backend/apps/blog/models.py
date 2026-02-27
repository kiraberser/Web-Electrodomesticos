from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.conf import settings
from django.utils import timezone

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
    class StatusChoices(models.TextChoices):
        DRAFT = 'draft', 'Borrador'
        PUBLISHED = 'published', 'Publicado'

    class RobotsChoices(models.TextChoices):
        INDEX = 'index, follow', 'Indexar'
        NOINDEX = 'noindex, nofollow', 'No indexar'

    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.TextField(blank=True, null=True)
    resume = models.TextField(blank=True, null=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(blank=True, null=True)
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        default=1
    )
    slug = models.SlugField(unique=True, blank=True)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.OTROS)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.DRAFT,
    )
    tags = TaggableManager()

    # SEO fields
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    focus_keyword = models.CharField(max_length=100, blank=True)
    robots = models.CharField(
        max_length=30,
        choices=RobotsChoices.choices,
        default=RobotsChoices.INDEX,
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['slug']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == self.StatusChoices.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('postdetail', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(
        Blog,
        on_delete=models.CASCADE,
        related_name='comments',
    )
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
        return f'Comment by {self.author} on {self.post.title}'
