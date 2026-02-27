from django.contrib import admin

from .models import Blog, Comment


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'autor', 'category', 'status', 'created_at', 'published_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'description', 'focus_keyword']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'published_at']
    date_hierarchy = 'created_at'
    fieldsets = (
        ('Contenido', {
            'fields': ('title', 'slug', 'description', 'resume', 'image', 'category', 'tags', 'autor'),
        }),
        ('Publicación', {
            'fields': ('status', 'created_at', 'published_at'),
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'focus_keyword', 'robots'),
            'classes': ('collapse',),
        }),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'active', 'created_at']
    list_filter = ['active', 'created_at']
    search_fields = ['author__username', 'body', 'post__title']
    actions = ['approve_comments', 'reject_comments']

    @admin.action(description='Aprobar comentarios seleccionados')
    def approve_comments(self, request, queryset):
        queryset.update(active=True)

    @admin.action(description='Rechazar comentarios seleccionados')
    def reject_comments(self, request, queryset):
        queryset.update(active=False)
