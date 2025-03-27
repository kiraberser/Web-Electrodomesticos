from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactViewSet, NewsletterViewSet

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'newsletters', NewsletterViewSet, basename='newsletter')

urlpatterns = [
    path('', include(router.urls)),
    
    # Contact routes
    path('contacts/', ContactViewSet.as_view({'get': 'list'}), name='contact-list'),
    path('contacts/submit/', ContactViewSet.as_view({'post': 'create'}), name='contact-submit'),
    
    # Newsletter routes
    path('newsletters/', NewsletterViewSet.as_view({'get': 'list'}), name='newsletter-list'),
    path('newsletters/subscribe/', NewsletterViewSet.as_view({'post': 'create'}), name='newsletter-subscribe'),
]