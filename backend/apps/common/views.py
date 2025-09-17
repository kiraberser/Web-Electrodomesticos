
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from django.conf import settings
from django.db import IntegrityError

from .models import Contact, Newsletter
from .serializers import ContactSerializer, NewsletterSerializer

import brevo_python
from brevo_python.rest import ApiException

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
        # Validación vía serializer (incluye unicidad case-insensitive)
        serializer = self.get_serializer(data={'email': (request.data.get('email') or '').strip().lower()})
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # Enviar correo de confirmación con Brevo (SDK oficial)
        template_id = getattr(settings, 'BREVO_TEMPLATE_NEWSLETTER_CONFIRM', 0)
        try:
            # Validaciones de configuración para evitar 500 por falta de credenciales
            if not getattr(settings, 'BREVO_API_KEY', None):
                return Response({'message': 'Falta configurar BREVO_API_KEY'}, status=status.HTTP_400_BAD_REQUEST)

            configuration = brevo_python.Configuration()
            configuration.api_key['api-key'] = settings.BREVO_API_KEY
            api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(configuration))

            if template_id and template_id > 0:
                send_smtp_email = brevo_python.SendSmtpEmail(
                    to=[{"email": email}],
                    template_id=template_id,
                    params={
                        "email": email,
                        "COMPANY_NAME": getattr(settings, 'COMPANY_NAME', ''),
                        "FIRST_NAME": "Alfredo",
                        "LAST_NAME": "Vega",
                        "order_id": "10ED",
                    },
                )
                api_instance.send_transac_email(send_smtp_email)
            else:
                if not getattr(settings, 'BREVO_SENDER_EMAIL', None):
                    return Response({'message': 'Falta configurar BREVO_SENDER_EMAIL para envíos sin template'}, status=status.HTTP_400_BAD_REQUEST)
                send_smtp_email = brevo_python.SendSmtpEmail(
                    to=[{"email": email}],
                    subject='Confirmación de suscripción a la Newsletter',
                    html_content='Gracias por suscribirte a nuestra newsletter. Te mantendremos informado con las últimas novedades.',
                    sender={"email": settings.BREVO_SENDER_EMAIL, "name": getattr(settings, 'BREVO_SENDER_NAME', '')},
                )
                api_instance.send_transac_email(send_smtp_email)
        except ApiException as exc:  # type: ignore
            detail = getattr(exc, 'body', None) or str(exc)
            status_code = getattr(exc, 'status', 400)
            return Response({
                'message': 'Brevo rechazó el envío',
                'error': detail,
                'status': status_code,
            }, status=status_code if isinstance(status_code, int) else status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return Response({
                'message': 'No fue posible enviar el email de confirmación',
                'error': str(exc)
            }, status=status.HTTP_400_BAD_REQUEST)
        # Crear la suscripción con manejo de colisión de unicidad
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response({'message': 'Este email ya está suscrito a la newsletter'}, status=status.HTTP_400_BAD_REQUEST)
        
        headers = self.get_success_headers(serializer.data)
        return Response({
            'message': 'Suscripción a newsletter creada exitosamente',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)
