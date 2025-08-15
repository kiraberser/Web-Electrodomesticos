from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response

from .models import Comment
from .serializers import CommentSerializer

from .models import Blog
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Posts
    Soporta: listar, crear, recuperar, actualizar y eliminar posts
    Incluye búsqueda, ordenación y control de permisos.
    """
    queryset = Blog.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'slug'

    # Filtros y ordenación
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']  # Orden por defecto

    def get_permissions(self):
        """
        Define permisos por acción:
        - list/retrieve: acceso público
        - create/update/destroy: requiere autenticación
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [p() for p in permission_classes]

    def create(self, request, *args, **kwargs):
        """
        Lógica de creación personalizada (si en un futuro quieres validaciones extra).
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """
        Lógica de actualización personalizada.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


    
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()