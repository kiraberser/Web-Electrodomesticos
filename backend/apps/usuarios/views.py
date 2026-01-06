from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import Usuario, Direccion
from .serializers import (
    RegistroSerializer, 
    LoginSerializer, 
    UserProfileSerializer, 
    UpdateUserProfileSerializer,
    DireccionSerializer,
    CreateDireccionSerializer,
    FavoritoListSerializer,
    AgregarFavoritoSerializer
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