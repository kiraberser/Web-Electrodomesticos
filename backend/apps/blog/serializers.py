import json

from taggit.serializers import TagListSerializerField, TaggitSerializer
from rest_framework import serializers

from .models import Blog, Comment


class PostSerializer(TaggitSerializer, serializers.ModelSerializer):
    autor_name = serializers.ReadOnlyField(source='autor.username')
    tags = TagListSerializerField()
    read_time = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'description', 'resume', 'image',
            'autor', 'autor_name', 'created_at', 'published_at',
            'category', 'slug', 'status', 'tags',
            'meta_title', 'meta_description', 'focus_keyword', 'robots',
            'read_time',
        ]
        read_only_fields = ['id', 'created_at', 'published_at', 'autor']

    def get_read_time(self, obj) -> int:
        word_count = len(obj.description.split())
        return max(1, round(word_count / 200))

    def to_internal_value(self, data):
        # Accept tags as a JSON string (multipart) or a native list (JSON body)
        mutable = data.copy() if hasattr(data, 'copy') else dict(data)
        tags = mutable.get('tags')
        if isinstance(tags, str):
            try:
                mutable['tags'] = json.loads(tags)
            except (json.JSONDecodeError, TypeError):
                mutable['tags'] = [t.strip() for t in tags.split(',') if t.strip()]
        return super().to_internal_value(mutable)

    def validate_title(self, value):
        qs = Blog.objects.filter(title=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Este título ya existe')
        return value


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_name', 'body', 'created_at', 'updated_at', 'active']
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']
        extra_kwargs = {
            'post': {'write_only': True},
            'active': {'required': False},
        }
