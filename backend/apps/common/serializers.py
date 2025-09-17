from rest_framework import serializers
from .models import Contact, Newsletter

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['created_at']

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'created_at', 'is_active']
        read_only_fields = ['created_at']

    def validate_email(self, value: str) -> str:
        email = (value or '').strip().lower()
        if not email:
            raise serializers.ValidationError('Email es requerido')
        # Si existe una instancia (update), permitir el mismo email
        instance = getattr(self, 'instance', None)
        exists = Newsletter.objects.filter(email__iexact=email)
        if instance is not None:
            exists = exists.exclude(pk=instance.pk)
        if exists.exists():
            raise serializers.ValidationError('Este email ya está suscrito a la newsletter')
        return email

    def create(self, validated_data):
        email = validated_data.get('email', '').lower()
        is_active = validated_data.get('is_active', True)
        return Newsletter.objects.create(email=email, is_active=is_active)
