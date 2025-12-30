from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password','phone']
        extra_kwargs = {
            'email': {'required': True},
            'password': {'required': True},
            'phone': {'required': True}
        }
        
    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone']
        )
        
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este correo ya existe')
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este nombre de usuario ya existe')
        return value
    
    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError('Este número de teléfono ya existe')
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para obtener los datos del perfil del usuario"""
    full_address = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'bio',
            'avatar',
            'address_street',
            'address_colony',
            'address_city',
            'address_state',
            'address_postal_code',
            'address_references',
            'full_address',
            'address',  # Legacy field
            'date_joined',
            'is_staff',
            'is_superuser',
        ]
        read_only_fields = ['id', 'date_joined', 'is_staff', 'is_superuser', 'full_address']
    
    def get_full_address(self, obj):
        """Retorna la dirección completa formateada"""
        return obj.get_full_address()


class UpdateUserProfileSerializer(serializers.ModelSerializer):
    """Serializer para actualizar el perfil del usuario"""
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address_postal_code = serializers.CharField(max_length=10, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'bio',
            'address_street',
            'address_colony',
            'address_city',
            'address_state',
            'address_postal_code',
            'address_references',
            'avatar',
        ]
    
    def validate_address_postal_code(self, value):
        """Validar formato de código postal (solo números, 5 dígitos para México)"""
        if value and value.strip():
            # Remover espacios y guiones
            cleaned = value.replace(' ', '').replace('-', '')
            if not cleaned.isdigit():
                raise serializers.ValidationError('El código postal debe contener solo números')
            if len(cleaned) != 5:
                raise serializers.ValidationError('El código postal debe tener 5 dígitos')
        return value
    
    def validate_email(self, value):
        """Validar que el email sea único, excepto para el usuario actual"""
        user = self.instance
        if value and User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError('Este correo ya está en uso')
        return value
    
    def validate_phone(self, value):
        """Validar que el teléfono sea único, excepto para el usuario actual"""
        user = self.instance
        if value and User.objects.filter(phone=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError('Este número de teléfono ya está en uso')
        return value
    
    def update(self, instance, validated_data):
        """Actualizar instancia del usuario"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance