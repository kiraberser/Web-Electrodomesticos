from django.utils import timezone
from rest_framework import viewsets, permissions, filters

from .models import Blog, Comment
from .serializers import PostSerializer, CommentSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    CRUD del blog.
    - list/retrieve: público (anónimos solo ven publicados)
    - create/update/destroy: requiere ser staff
    Filtros: ?category=Motor  ?status=draft (solo staff)
    Búsqueda: ?search=texto
    """
    serializer_class = PostSerializer
    lookup_field = 'slug'

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'focus_keyword']
    ordering_fields = ['created_at', 'published_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Blog.objects.all()
        user = self.request.user

        # Usuarios anónimos y no-staff solo ven publicados
        if self.action == 'list' and not (user and user.is_staff):
            qs = qs.filter(status=Blog.StatusChoices.PUBLISHED)

        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)

        status_filter = self.request.query_params.get('status')
        if status_filter and user and user.is_staff:
            qs = qs.filter(status=status_filter)

        return qs

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        published_at = None
        if serializer.validated_data.get('status') == Blog.StatusChoices.PUBLISHED:
            published_at = timezone.now()
        serializer.save(autor=self.request.user, published_at=published_at)

    def perform_update(self, serializer):
        instance = self.get_object()
        published_at = instance.published_at
        if (
            serializer.validated_data.get('status') == Blog.StatusChoices.PUBLISHED
            and not published_at
        ):
            published_at = timezone.now()
        serializer.save(published_at=published_at)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    lookup_field = 'id'

    def get_queryset(self):
        qs = Comment.objects.filter(active=True)
        post_slug = self.request.query_params.get('post')
        if post_slug:
            qs = qs.filter(post__slug=post_slug)
        return qs

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
