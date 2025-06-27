from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactViewSet, NewsletterViewSet

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'newsletters', NewsletterViewSet, basename='newsletter')

urlpatterns = [
    path('', include(router.urls)),
]