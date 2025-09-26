from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError

from .models import Usuario
from .serializers import RegistroSerializer, LoginSerializer

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