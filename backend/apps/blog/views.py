from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.utils.text import slugify
from rest_framework.decorators import action

from .models import Blog, Comment
from .serializers import PostSerializer, CommentSerializer



class PostListView(generics.ListAPIView):
    """
    Vista para listar todos los posts del blog
    Soporta paginación y filtrado por título
    """
    queryset = Blog.objects.all()
    serializer_class = PostSerializer

    
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
    serializer_class = PostSerializer
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
    
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()