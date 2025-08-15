from taggit.serializers import TagListSerializerField, TaggitSerializer
from rest_framework import serializers
from .models import Blog, Comment

class PostSerializer(TaggitSerializer,serializers.ModelSerializer):
    autor_name = serializers.ReadOnlyField(source='autor.username')  # Campo de solo lectura para el autor
    tags = TagListSerializerField()  # Campo para manejar etiquetas con Taggit
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'description', 'image', 'autor', 'created_at', 'category', 'slug', 'autor_name', 'tags']
        read_only_fields = ['id', 'created_at', 'autor']  # Campos que no se pueden modificar por el usuario
        
    def validate_title(self, value): 
        if Blog.objects.filter(title=value).exists():
            raise serializers.ValidationError('Este título ya existe')
        return value
    
        
class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')  # Campo de solo lectura para el autor del comentario

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_name', 'body', 'created_at', 'updated_at', 'active']
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']  # Campos que no se pueden modificar por el usuario
        extra_kwargs = {
            'post': {'write_only': True},  # El post no debe ser editable directamente
            'active': {'required': False}  # Permite que active sea opcional al crear un comentario
        }