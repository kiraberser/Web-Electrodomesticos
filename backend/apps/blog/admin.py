from django.contrib import admin
from .models import Blog

# Registrar el modelo Blog para que se muestre en el admin de Django
admin.site.register(Blog)