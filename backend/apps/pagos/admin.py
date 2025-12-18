from django.contrib import admin
from .models import Pago

@admin.register(Pago)   
class PagoAdmin(admin.ModelAdmin):
    list_display = ['id', 'pedido', 'usuario', 'status', 'amount', 'currency', 'payment_id', 'fecha_creacion']
    list_filter = ['status', 'currency', 'fecha_creacion']
    search_fields = ['payment_id', 'preference_id', 'usuario__email', 'usuario__username']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion', 'fecha_aprobacion', 'mp_data']
    date_hierarchy = 'fecha_creacion'
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('pedido', 'usuario', 'status', 'status_detail')
        }),
        ('Mercado Pago', {
            'fields': ('preference_id', 'payment_id', 'payment_method_id', 'payment_type_id')
        }),
        ('Información Financiera', {
            'fields': ('amount', 'currency')
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'fecha_actualizacion', 'fecha_aprobacion')
        }),
        ('Datos Adicionales', {
            'fields': ('mp_data',),
            'classes': ('collapse',)
        }),
    )
