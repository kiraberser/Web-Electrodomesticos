from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Direccion, Cart, CartItem
from apps.productos.models import Refaccion
from apps.productos.serializers import RefaccionSerializer

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


class DireccionSerializer(serializers.ModelSerializer):
    """Serializer para direcciones de envío"""
    full_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Direccion
        fields = [
            'id',
            'nombre',
            'street',
            'colony',
            'city',
            'state',
            'postal_code',
            'references',
            'is_primary',
            'full_address',
            'tipo_lugar',
            'barrio_privado',
            'conserjeria',
            'nombre_lugar',
            'horario_apertura',
            'horario_cierre',
            'horario_24hs',
            'horarios_adicionales',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'full_address']
    
    def get_full_address(self, obj):
        """Retorna la dirección completa formateada"""
        return obj.get_full_address()
    
    def validate_postal_code(self, value):
        """Validar formato de código postal"""
        if value and value.strip():
            cleaned = value.replace(' ', '').replace('-', '')
            if not cleaned.isdigit():
                raise serializers.ValidationError('El código postal debe contener solo números')
            if len(cleaned) != 5:
                raise serializers.ValidationError('El código postal debe tener 5 dígitos')
        return value
    
    def validate(self, data):
        """Validar que no haya más de 3 direcciones"""
        usuario = self.context['request'].user
        if self.instance is None:  # Creación
            if Direccion.objects.filter(usuario=usuario).count() >= 3:
                raise serializers.ValidationError("No puedes tener más de 3 direcciones de envío")
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para obtener los datos del perfil del usuario"""
    full_address = serializers.SerializerMethodField()
    primary_address = serializers.SerializerMethodField()
    cart_items = serializers.SerializerMethodField()
    
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
            'cart_items',
            # Campos legacy de dirección (deprecados, usar Direccion model)
            'address_street',
            'address_colony',
            'address_city',
            'address_state',
            'address_postal_code',
            'address_references',
            'address',  # Legacy field
            # Campos nuevos desde Direccion
            'full_address',
            'primary_address',
            'date_joined',
            'is_staff',
            'is_superuser',
        ]
        read_only_fields = ['id', 'date_joined', 'is_staff', 'is_superuser', 'full_address', 'primary_address', 'cart_items']
    
    def get_full_address(self, obj):
        """Retorna la dirección completa formateada desde Direccion principal o campos legacy"""
        return obj.get_full_address()
    
    def get_primary_address(self, obj):
        """Retorna la dirección principal desde el modelo Direccion"""
        primary = obj.get_primary_address()
        if primary:
            return DireccionSerializer(primary).data
        return None

    def get_cart_items(self, obj):
        """Retorna los items del carrito con cantidades"""
        try:
            cart = obj.cart
        except Cart.DoesNotExist:
            return []
        return CartItemSerializer(cart.items.all(), many=True).data


class UpdateUserProfileSerializer(serializers.ModelSerializer):
    """Serializer para actualizar el perfil del usuario
    
    NOTA: Los campos de dirección (address_*) están deprecados.
    Para gestionar direcciones, usar el modelo Direccion y sus endpoints.
    """
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
            # Campos legacy de dirección (deprecados, mantener solo para compatibilidad)
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


class CreateDireccionSerializer(serializers.ModelSerializer):
    """Serializer para crear direcciones"""
    
    class Meta:
        model = Direccion
        fields = [
            'nombre',
            'street',
            'colony',
            'city',
            'state',
            'postal_code',
            'references',
            'is_primary',
            'tipo_lugar',
            'barrio_privado',
            'conserjeria',
            'nombre_lugar',
            'horario_apertura',
            'horario_cierre',
            'horario_24hs',
            'horarios_adicionales',
        ]
    
    def validate_postal_code(self, value):
        """Validar formato de código postal"""
        if value and value.strip():
            cleaned = value.replace(' ', '').replace('-', '')
            if not cleaned.isdigit():
                raise serializers.ValidationError('El código postal debe contener solo números')
            if len(cleaned) != 5:
                raise serializers.ValidationError('El código postal debe tener 5 dígitos')
        return value
    
    def validate(self, data):
        """Validar límite de direcciones"""
        usuario = self.context['request'].user
        if Direccion.objects.filter(usuario=usuario).count() >= 3:
            raise serializers.ValidationError("No puedes tener más de 3 direcciones de envío")
        return data


class FavoritoListSerializer(serializers.Serializer):
    """Serializer para listar productos favoritos"""
    id = serializers.IntegerField()
    codigo_parte = serializers.CharField()
    nombre = serializers.CharField()
    descripcion = serializers.CharField(allow_blank=True)
    marca = serializers.CharField()
    marca_nombre = serializers.CharField()
    categoria = serializers.IntegerField()
    categoria_nombre = serializers.CharField()
    precio = serializers.DecimalField(max_digits=10, decimal_places=2)
    existencias = serializers.IntegerField()
    estado = serializers.CharField()
    compatibilidad = serializers.CharField()
    imagen = serializers.URLField(allow_blank=True, allow_null=True)
    fecha_ingreso = serializers.DateTimeField()
    ultima_actualizacion = serializers.DateTimeField()


class AgregarFavoritoSerializer(serializers.Serializer):
    """Serializer para agregar un producto a favoritos"""
    refaccion_id = serializers.IntegerField()
    
    def validate_refaccion_id(self, value):
        """Validar que el producto exista"""
        try:
            Refaccion.objects.get(pk=value)
        except Refaccion.DoesNotExist:
            raise serializers.ValidationError("El producto no existe")
        return value
    
    def validate(self, data):
        """Validar límite de favoritos"""
        usuario = self.context['request'].user
        if usuario.favoritos.count() >= 20:
            raise serializers.ValidationError("No puedes tener más de 20 productos en favoritos")
        
        refaccion = Refaccion.objects.get(pk=data['refaccion_id'])
        if usuario.favoritos.filter(pk=refaccion.pk).exists():
            raise serializers.ValidationError("Este producto ya está en tus favoritos")
        
        return data


class CartItemSerializer(serializers.ModelSerializer):
    refaccion = RefaccionSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'refaccion', 'cantidad', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AgregarCartSerializer(serializers.Serializer):
    """Serializer para agregar un producto al carrito"""
    refaccion_id = serializers.IntegerField()
    cantidad = serializers.IntegerField(required=False, min_value=1, default=1)

    def validate_refaccion_id(self, value):
        """Validar que el producto exista"""
        try:
            Refaccion.objects.get(pk=value)
        except Refaccion.DoesNotExist:
            raise serializers.ValidationError("El producto no existe")
        return value

    def validate(self, data):
        """Evitar duplicados en carrito"""
        usuario = self.context['request'].user
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer para solicitar recuperación de contraseña"""
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        """Validar formato de email"""
        if not value:
            raise serializers.ValidationError("El correo electrónico es requerido")
        return value.lower().strip()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer para confirmar y cambiar la contraseña"""
    token = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        min_length=8,
        help_text="La contraseña debe tener al menos 8 caracteres"
    )
    password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate_password(self, value):
        """Validación básica de contraseña (validaciones detalladas en frontend con Zod)"""
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres")
        return value
    
    def validate(self, data):
        """Validar que las contraseñas coincidan"""
        password = data.get('password')
        password_confirm = data.get('password_confirm')
        
        if password and password_confirm and password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden'
            })
        
        return data


class PasswordResetTokenValidateSerializer(serializers.Serializer):
    """Serializer para validar un token de recuperación"""
    token = serializers.CharField(required=True)


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambiar contraseña desde el perfil (requiere contraseña actual)"""
    current_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        help_text="Tu contraseña actual"
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        min_length=8,
        help_text="La nueva contraseña debe tener al menos 8 caracteres"
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        help_text="Confirma tu nueva contraseña"
    )
    
    def validate_new_password(self, value):
        """Validación básica de contraseña (validaciones detalladas en frontend con Zod)"""
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres")
        return value
    
    def validate(self, data):
        """Validar que las nuevas contraseñas coincidan"""
        new_password = data.get('new_password')
        new_password_confirm = data.get('new_password_confirm')
        
        if new_password and new_password_confirm and new_password != new_password_confirm:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden'
            })
        
        return data