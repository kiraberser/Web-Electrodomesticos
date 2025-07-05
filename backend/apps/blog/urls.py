from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, PostListView

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
    path('', include(router.urls)),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/create/', PostViewSet.as_view({'post': 'create'}), name='post-create'),
    path('post/<slug:slug>/', PostViewSet.as_view({'get': 'retrieve'}), name='post-detail'),
    path('post/<slug:slug>/edit/', PostViewSet.as_view({'put': 'update', 'patch': 'partial_update'}), name='post-edit'),
]
