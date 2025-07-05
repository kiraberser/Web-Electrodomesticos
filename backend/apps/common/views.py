
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from django.core.mail import send_mail
from django.conf import settings

from .models import Contact, Newsletter


from .serializers import ContactSerializer, NewsletterSerializer
# ViewSets
class ContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Contactos
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        """
        Personaliza la creación de un nuevo contacto
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response({
            'message': 'Contacto creado exitosamente',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], url_path='submit')
    def custom_create(self, request):
        """
        Método alternativo para crear contactos
        """
        return self.create(request)

class NewsletterViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Newsletters
    """
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    sent = False

    def create(self, request, *args, **kwargs):
        """
        Personaliza la creación de una nueva suscripción de newsletter
        """
        # Verificar si el email ya existe
        email = request.data.get('email')
        if Newsletter.objects.filter(email=email).exists():
            return Response({
                'message': 'Este email ya está suscrito a la newsletter'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Enviar correo de confirmación
        send_mail(
            subject='Confirmación de suscripción a la Newsletter',
            message='Gracias por suscribirte a nuestra newsletter. Te mantendremos informado con las últimas novedades.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )
        # Crear la suscripción
        request.data['email'] = email.lower()  # Normalizar el email a minúsculas
        request.data['is_active'] = True  # Asegurarse de que la suscripción esté activa
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response({
            'message': 'Suscripción a newsletter creada exitosamente',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], url_path='subscribe')
    def custom_subscribe(self, request):
        """
        Método alternativo para suscribirse a la newsletter
        """
        return self.create(request)