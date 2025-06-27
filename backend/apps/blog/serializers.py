from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    autor_name = serializers.ReadOnlyField(source='autor.username')  # Campo de solo lectura para el autor
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'description', 'image', 'autor', 'created_at', 'category', 'slug', 'autor_name']
        read_only_fields = ['id', 'created_at', 'slug', 'autor']  # Campos que no se pueden modificar por el usuario