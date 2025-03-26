from django.db import models
from django.utils.text import slugify
from django.urls import reverse

class Blog(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    date = models.DateField(auto_now_add=True)
    slug = models.SlugField(unique=True, blank=True)
    category = models.TextChoices("Motor", "Minisplit","Lavadora", 
                                "Ventialodor", "Secadora", "Refrigerador", 
                                "Estufa", "Horno", "Microondas", "Licuadora",
                                "Batidora", "Tostador", "Cafetera", "Plancha", 
                                "Aspiradora", "Otros")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)  # Genera el slug a partir del título
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('blogdetail', kwargs={'slug': self.slug})

    def __str__(self): #magic method "__str__" 
        return self.title
