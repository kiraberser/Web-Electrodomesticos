from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
import brevo_python
from brevo_python.rest import ApiException

from .models import Usuario, Direccion
from .serializers import (
    RegistroSerializer, 
    LoginSerializer, 
    UserProfileSerializer, 
    UpdateUserProfileSerializer,
    DireccionSerializer,
    CreateDireccionSerializer,
    FavoritoListSerializer,
    AgregarFavoritoSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetTokenValidateSerializer,
    ChangePasswordSerializer
)
from apps.productos.models import Refaccion
from apps.productos.serializers import RefaccionSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class RegistroUsuarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid(): 
            user = serializer.save()

            return Response({
                'message': 'Usuario registado exitosamente',
                'user': RegistroSerializer(user).data,
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUsuarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = Usuario.objects.get(email=serializer.validated_data['email'])
            except Usuario.DoesNotExist:
                return Response({'detail': 'Credenciales Invalidas'}, status=status.HTTP_401_UNAUTHORIZED)
            if not user.check_password(serializer.validated_data['password']):
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Build JWTs with custom role/permissions claims
            refresh = RefreshToken.for_user(user)
            # Common claims – customize as needed
            is_admin = bool(getattr(user, 'is_staff', False) or getattr(user, 'is_superuser', False))
            role = 'admin' if is_admin else 'user'

            # Add claims to refresh token
            refresh['username'] = user.username
            refresh['is_admin'] = is_admin
            refresh['is_staff'] = bool(getattr(user, 'is_staff', False))
            refresh['is_superuser'] = bool(getattr(user, 'is_superuser', False))
            refresh['role'] = role

            # Access token inherits from refresh, but we can also set explicitly
            access = refresh.access_token
            access['username'] = user.username
            access['is_admin'] = is_admin
            access['is_staff'] = bool(getattr(user, 'is_staff', False))
            access['is_superuser'] = bool(getattr(user, 'is_superuser', False))
            access['role'] = role

            return Response({
                'usuario': user.username,
                'refresh': str(refresh),
                'access': str(access)
            }, status=status.HTTP_200_OK)
            
class GetUserData(APIView):
    """
    Vista para obtener la información del perfil del usuario autenticado
    Requiere autenticación mediante JWT
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Retorna los datos del usuario autenticado
        """
        user = request.user
        serializer = UserProfileSerializer(user)
        
        return Response({
            'usuario': serializer.data
        }, status=status.HTTP_200_OK)


class UpdateUserProfileView(APIView):
    """
    Vista para actualizar la información del perfil del usuario autenticado
    Requiere autenticación mediante JWT
    Solo permite actualizar el propio perfil
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        """
        Actualiza los datos del usuario autenticado (actualización completa)
        """
        user = request.user
        serializer = UpdateUserProfileSerializer(user, data=request.data, partial=False)
        
        if serializer.is_valid():
            serializer.save()
            updated_user = UserProfileSerializer(user)
            return Response({
                'message': 'Perfil actualizado exitosamente',
                'usuario': updated_user.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """
        Actualiza los datos del usuario autenticado (actualización parcial)
        """
        user = request.user
        serializer = UpdateUserProfileSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            updated_user = UserProfileSerializer(user)
            return Response({
                'message': 'Perfil actualizado exitosamente',
                'usuario': updated_user.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DireccionesListView(APIView):
    """
    Vista para listar y crear direcciones del usuario autenticado
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Obtener todas las direcciones del usuario"""
        direcciones = Direccion.objects.filter(usuario=request.user)
        serializer = DireccionSerializer(direcciones, many=True)
        return Response({
            'direcciones': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Crear una nueva dirección"""
        serializer = CreateDireccionSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Asignar el usuario actual
            direccion = serializer.save(usuario=request.user)
            
            # Si se marca como principal, desmarcar las demás
            if direccion.is_primary:
                Direccion.objects.filter(
                    usuario=request.user,
                    is_primary=True
                ).exclude(pk=direccion.pk).update(is_primary=False)
            
            response_serializer = DireccionSerializer(direccion)
            return Response({
                'message': 'Dirección creada exitosamente',
                'direccion': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DireccionDetailView(APIView):
    """
    Vista para obtener, actualizar y eliminar una dirección específica
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk, usuario):
        """Obtener la dirección o retornar 404"""
        try:
            return Direccion.objects.get(pk=pk, usuario=usuario)
        except Direccion.DoesNotExist:
            return None
    
    def get(self, request, pk):
        """Obtener una dirección específica"""
        direccion = self.get_object(pk, request.user)
        if not direccion:
            return Response(
                {'detail': 'Dirección no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DireccionSerializer(direccion)
        return Response({
            'direccion': serializer.data
        }, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        """Actualizar una dirección"""
        direccion = self.get_object(pk, request.user)
        if not direccion:
            return Response(
                {'detail': 'Dirección no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CreateDireccionSerializer(
            direccion,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            
            # Si se marca como principal, desmarcar las demás
            if direccion.is_primary:
                Direccion.objects.filter(
                    usuario=request.user,
                    is_primary=True
                ).exclude(pk=direccion.pk).update(is_primary=False)
            
            response_serializer = DireccionSerializer(direccion)
            return Response({
                'message': 'Dirección actualizada exitosamente',
                'direccion': response_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Eliminar una dirección"""
        direccion = self.get_object(pk, request.user)
        if not direccion:
            return Response(
                {'detail': 'Dirección no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        direccion.delete()
        return Response(
            {'message': 'Dirección eliminada exitosamente'},
            status=status.HTTP_200_OK
        )


class FavoritosListView(APIView):
    """
    Vista para listar y agregar productos favoritos del usuario autenticado
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Obtener todos los productos favoritos del usuario"""
        favoritos = request.user.favoritos.all()
        serializer = RefaccionSerializer(favoritos, many=True)
        return Response({
            'favoritos': serializer.data,
            'total': favoritos.count()
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Agregar un producto a favoritos"""
        serializer = AgregarFavoritoSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            refaccion_id = serializer.validated_data['refaccion_id']
            refaccion = Refaccion.objects.get(pk=refaccion_id)
            
            try:
                request.user.agregar_favorito(refaccion)
                refaccion_serializer = RefaccionSerializer(refaccion)
                return Response({
                    'message': 'Producto agregado a favoritos exitosamente',
                    'favorito': refaccion_serializer.data
                }, status=status.HTTP_201_CREATED)
            except DjangoValidationError as e:
                return Response(
                    {'detail': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoritoDetailView(APIView):
    """
    Vista para eliminar un producto de favoritos
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, refaccion_id):
        """Eliminar un producto de favoritos"""
        try:
            refaccion = Refaccion.objects.get(pk=refaccion_id)
        except Refaccion.DoesNotExist:
            return Response(
                {'detail': 'Producto no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not request.user.favoritos.filter(pk=refaccion_id).exists():
            return Response(
                {'detail': 'Este producto no está en tus favoritos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.user.eliminar_favorito(refaccion)
        return Response(
            {'message': 'Producto eliminado de favoritos exitosamente'},
            status=status.HTTP_200_OK
        )


class PasswordResetRequestView(APIView):
    """
    Vista para solicitar recuperación de contraseña
    Envía un email con el token de recuperación
    Por seguridad, siempre retorna éxito aunque el email no exista
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        
        try:
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            # Por seguridad, no revelamos si el email existe o no
            # Retornamos éxito para evitar enumeración de usuarios
            return Response({
                'message': 'Si el correo existe, recibirás un enlace para restablecer tu contraseña'
            }, status=status.HTTP_200_OK)
        
        # Generar token seguro
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Construir URL de reset (frontend)
        frontend_url = request.data.get('frontend_url', 'http://localhost:3000')
        reset_url = f"{frontend_url}/cuenta/reset-password/{uid}/{token}"
        
        # Enviar email con Brevo
        try:
            # Validaciones de configuración para evitar 500 por falta de credenciales
            if not getattr(settings, 'BREVO_API_KEY', None):
                if settings.DEBUG:
                    print("Falta configurar BREVO_API_KEY")
                # Retornar éxito de todas formas por seguridad
                return Response({
                    'message': 'Si el correo existe, recibirás un enlace para restablecer tu contraseña'
                }, status=status.HTTP_200_OK)

            if not getattr(settings, 'BREVO_SENDER_EMAIL', None):
                if settings.DEBUG:
                    print("Falta configurar BREVO_SENDER_EMAIL")
                # Retornar éxito de todas formas por seguridad
                return Response({
                    'message': 'Si el correo existe, recibirás un enlace para restablecer tu contraseña'
                }, status=status.HTTP_200_OK)

            configuration = brevo_python.Configuration()
            configuration.api_key['api-key'] = settings.BREVO_API_KEY
            api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(configuration))

            # Mensaje HTML simple para recuperación de contraseña
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0A3981;">Recuperación de Contraseña</h2>
                <p>Hola {user.username},</p>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                <p style="margin: 20px 0;">
                    <a href="{reset_url}" style="background-color: #0A3981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Restablecer Contraseña
                    </a>
                </p>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #666;">{reset_url}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    Este enlace expirará en 1 hora.<br>
                    Si no solicitaste este cambio, ignora este correo.
                </p>
                <p style="margin-top: 20px;">
                    Saludos,<br>
                    <strong>Equipo de {getattr(settings, 'COMPANY_NAME', 'Refaccionaria Vega')}</strong>
                </p>
            </div>
            """

            send_smtp_email = brevo_python.SendSmtpEmail(
                to=[{"email": email}],
                subject=f'Recuperación de contraseña - {getattr(settings, "COMPANY_NAME", "Refaccionaria Vega")}',
                html_content=html_content,
                sender={
                    "email": settings.BREVO_SENDER_EMAIL,
                    "name": getattr(settings, 'BREVO_SENDER_NAME', 'Refaccionaria Vega')
                },
            )
            api_instance.send_transac_email(send_smtp_email)
        except ApiException as exc:  # type: ignore
            # En desarrollo, loguear el error pero no revelarlo al usuario
            if settings.DEBUG:
                detail = getattr(exc, 'body', None) or str(exc)
                print(f"Error enviando email con Brevo: {detail}")
            # Retornar éxito de todas formas por seguridad
        except Exception as e:
            # En desarrollo, loguear el error pero no revelarlo al usuario
            if settings.DEBUG:
                print(f"Error enviando email: {e}")
            # Retornar éxito de todas formas por seguridad
        
        return Response({
            'message': 'Si el correo existe, recibirás un enlace para restablecer tu contraseña'
        }, status=status.HTTP_200_OK)


class PasswordResetTokenValidateView(APIView):
    """
    Vista para validar un token de recuperación antes de mostrar el formulario
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetTokenValidateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        token = serializer.validated_data['token']
        uid = request.data.get('uid')
        
        if not uid:
            return Response(
                {'detail': 'UID es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = Usuario.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response(
                {'detail': 'Token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar token
        if not default_token_generator.check_token(user, token):
            return Response(
                {'detail': 'Token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'message': 'Token válido',
            'valid': True
        }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """
    Vista para confirmar y cambiar la contraseña usando el token
    Invalida todas las sesiones JWT activas del usuario
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['password']
        uid = request.data.get('uid')
        
        if not uid:
            return Response(
                {'detail': 'UID es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = Usuario.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response(
                {'detail': 'Token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar token
        if not default_token_generator.check_token(user, token):
            return Response(
                {'detail': 'Token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar contraseña
        user.set_password(new_password)
        user.save()
        
        # Invalidar todas las sesiones JWT activas del usuario
        try:
            outstanding_tokens = OutstandingToken.objects.filter(user=user)
            for outstanding_token in outstanding_tokens:
                BlacklistedToken.objects.get_or_create(token=outstanding_token)
        except Exception as e:
            # Si falla la invalidación, loguear pero continuar
            if settings.DEBUG:
                print(f"Error invalidando tokens: {e}")
        
        return Response({
            'message': 'Contraseña restablecida exitosamente. Por favor inicia sesión con tu nueva contraseña.'
        }, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """
    Vista para cambiar la contraseña desde el perfil del usuario autenticado
    Requiere autenticación y contraseña actual
    Invalida todas las sesiones JWT activas del usuario
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        current_password = serializer.validated_data['current_password']
        new_password = serializer.validated_data['new_password']
        
        # Verificar contraseña actual
        if not user.check_password(current_password):
            return Response(
                {'current_password': ['La contraseña actual es incorrecta']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que la nueva contraseña sea diferente a la actual
        if user.check_password(new_password):
            return Response(
                {'new_password': ['La nueva contraseña debe ser diferente a la actual']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar contraseña
        user.set_password(new_password)
        user.save()
        
        # Invalidar todas las sesiones JWT activas del usuario (excepto la actual si se desea mantener)
        try:
            outstanding_tokens = OutstandingToken.objects.filter(user=user)
            for outstanding_token in outstanding_tokens:
                BlacklistedToken.objects.get_or_create(token=outstanding_token)
        except Exception as e:
            # Si falla la invalidación, loguear pero continuar
            if settings.DEBUG:
                print(f"Error invalidando tokens: {e}")
        
        return Response({
            'message': 'Contraseña cambiada exitosamente. Por favor inicia sesión nuevamente.'
        }, status=status.HTTP_200_OK)