from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'description', 'image', 'autor', 'created_at', 'category', 'slug']
        read_only_fields = ['id', 'created_at', 'slug', 'autor']  # Campos que no se pueden modificar por el usuario