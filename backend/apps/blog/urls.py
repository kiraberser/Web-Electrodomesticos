from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('posts/', views.index, name='index'),  # Lista todos los posts
    path('post/<slug:slug>/', views.detail, name='detail'),  # Obtiene un post por slug
    path('post/create/', views.create_post, name='create'),  # Crea un nuevo post (autenticado)
    path('post/edit/<slug:slug>/', views.edit_post, name='edit'),  # Edita un post (autenticado)
]
