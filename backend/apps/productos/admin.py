from django.contrib import admin
from .models import Marca, Categoria, Refaccion, Proveedor

# Register your models here.
admin.site.register(Marca)
admin.site.register(Categoria)
admin.site.register(Refaccion)
admin.site.register(Proveedor)