from rest_framework import serializers
from .models import Pago


class PagoSerializer(serializers.ModelSerializer):
    """Serializer para información de pago"""
    
    class Meta:
        model = Pago
        fields = [
            'id',
            'preference_id',
            'payment_id',
            'status',
            'status_detail',
            'amount',
            'currency',
            'payment_method_id',
            'payment_type_id',
            'fecha_creacion',
            'fecha_aprobacion',
        ]
        read_only_fields = fields

