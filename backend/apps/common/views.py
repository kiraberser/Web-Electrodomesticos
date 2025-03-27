from rest_framework import serializers
from .models import Contact, Newsletter
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['created_at']

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'created_at']
        read_only_fields = ['created_at']

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