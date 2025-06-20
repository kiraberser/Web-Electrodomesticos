from django.contrib import admin
from .models import Servicio, ServicioReparado  # Asegúrate de importar los modelos Servicio y ServicioReparado desde tu aplicación servicios

# Register your models here.
admin.site.register([ Servicio, ServicioReparado ])  # Asegúrate de importar los modelos Servicio y ServicioReparado desde tu aplicación servicios