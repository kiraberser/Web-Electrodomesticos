# apps/productos/urls.py

from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    # path('', views.product_list, name='product_list'),  # Listar todos los productos
    # path('create/', views.create_product, name='create_product'),  # Crear un nuevo producto
    # path('detail/<int:id>/', views.product_detail, name='product_detail'),  # Detalle de un producto
]
