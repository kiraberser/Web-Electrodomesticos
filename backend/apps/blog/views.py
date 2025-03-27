from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.utils.text import slugify
from rest_framework.decorators import action

from .models import Blog
from .serializers import BlogSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Posts
    Soporta: listar, crear, recuperar, actualizar y eliminar posts
    """
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'slug'

    def create(self, request, *args, **kwargs):
        # Personaliza la lógica de creación
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Asegura que se genere un slug único
        title = serializer.validated_data.get('title')
        serializer.validated_data['slug'] = slugify(title)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        # Personaliza la lógica de actualización para regenerar el slug
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Si el título cambia, actualiza el slug
        if 'title' in request.data:
            request.data['slug'] = slugify(request.data['title'])
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create')
    def custom_create(self, request):
        # Método alternativo para manejar /create/
        return self.create(request)