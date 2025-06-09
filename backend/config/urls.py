# backend/config/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/blog/', include('apps.blog.urls')),  # Rutas para la app blog
    path('api/v1/common/', include('apps.common.urls')),  # Rutas para la app common
    path('api/v1/pagos/', include('apps.pagos.urls')),  # Rutas para la app pagos
    path('api/v1/pedidos/', include('apps.pedidos.urls')),  # Rutas para la app pedidos
    path('api/v1/productos/', include('apps.productos.urls')),  # Rutas para la app productos
    path('api/v1/user/', include('apps.usuarios.urls')),  # Rutas para la app usuarios
    path('api/v1/inventario/', include('apps.inventario.urls')),  # Rutas para la app inventario
]
