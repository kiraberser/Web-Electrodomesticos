from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .models import Blog
from .serializers import BlogSerializer

@api_view(['GET'])
def index(request):
    """Lista todos los posts"""
    posts = Blog.objects.all()
    serializer = BlogSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def detail(request, slug):
    """Obtiene un post por slug"""
    post = get_object_or_404(Blog, slug=slug)
    serializer = BlogSerializer(post)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    """Crea un nuevo post (solo usuarios autenticados)"""
    serializer = BlogSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save()
        post.slug = slugify(post.title)  # Genera el slug
        post.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_post(request, slug):
    """Edita un post existente (solo usuarios autenticados)"""
    post = get_object_or_404(Blog, slug=slug)
    serializer = BlogSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        post = serializer.save()
        post.slug = slugify(post.title)  # Asegura que el slug se actualice si cambia el título
        post.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
