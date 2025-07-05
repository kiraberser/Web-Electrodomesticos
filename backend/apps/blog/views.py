from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.utils.text import slugify
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination

from .models import Blog
from .serializers import BlogSerializer

class CustomPagination(PageNumberPagination):
    """
    Clase de paginación personalizada para los posts del blog
    """
    page_size = 5

class BlogListView(generics.ListAPIView):
    """
    Vista para listar todos los posts del blog
    Soporta paginación y filtrado por título
    """
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
        queryset = super().get_queryset()
        title = self.request.query_params.get('title', None)
        if title:
            queryset = queryset.filter(title__icontains=title)
        return queryset

class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Posts
    Soporta: listar, crear, recuperar, actualizar y eliminar posts
    """
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated | IsAdminUser]

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
        
        data = request.data.copy()
        
        # Si el título cambia, actualiza el slug
        if 'title' in data:
            data['slug'] = slugify(data['title'])

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create')
    def custom_create(self, request):
        # Método alternativo para manejar /create/
        return self.create(request)