import os
import hashlib 
import hmac
from django.db import transaction
import mercadopago
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny

from .models import Pago
from apps.pedidos.models import Pedido
from apps.pedidos.services import procesar_pedido_pagado
from .serializers import PagoSerializer

class CrearPreferenciaPagoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # 1. Configuración inicial
            access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
            if not access_token:
                return Response({'error': 'MERCADOPAGO_ACCESS_TOKEN faltante'}, status=500)

            sdk = mercadopago.SDK(access_token)

            # 2. Obtener y validar el pedido
            pedido_id = request.data.get('pedido_id')
            if not pedido_id:
                return Response({'error': 'pedido_id requerido'}, status=400)

            pedido = get_object_or_404(Pedido, id=pedido_id, usuario=request.user)

            if pedido.estado != Pedido.EstadoChoices.CREADO: # O el estado inicial que uses
                return Response({'error': 'El pedido no está disponible para pago'}, status=400)

            # ### CAMBIO CRITICO 1: Crear el objeto Pago ANTES de llamar a Mercado Pago
            # Esto es necesario para tener un ID único (pago.id) que rastrear
            pago = Pago.objects.create(
                pedido=pedido,
                usuario=request.user,
                amount=pedido.total, # Asegúrate que esto sea compatible con Decimal
                currency='MXN',
                status=Pago.EstadoChoices.PENDIENTE
            )

            # 3. Construir items para Mercado Pago
            items_mp = []
            for item in pedido.items.all():
                items_mp.append({
                    "title": item.refaccion.nombre[:250], # MP limita la longitud del título
                    "quantity": int(item.cantidad),
                    "unit_price": float(item.precio_unitario), # Convertir Decimal a Float
                    "currency_id": "MXN"
                })
            
            debug_backend_url = os.getenv('BACKEND_URL')
            print(debug_backend_url)
            debug_frontend_url = os.getenv('FRONTEND_URL')

            final_back_urls = {
                "success": f"{debug_frontend_url}/pago/exito",
                "failure": f"{debug_frontend_url}/pago/fallo",
                "pending": f"{debug_frontend_url}/pago/pendiente"
            }

            preference_data = {
                "items": items_mp,
                "payer": {
                    "name": request.user.first_name or "Usuario",
                    "surname": request.user.last_name or "Test",
                    "email": request.user.email,
                },
                "back_urls": final_back_urls,
                "auto_return": "approved",
                "external_reference": str(pago.id),
                "notification_url": f"{debug_backend_url}/api/v1/pagos/webhook/",
                "expires": True,
            }
            # 4. Crear preferencia en MP
            preference_response = sdk.preference().create(preference_data)
            
            # Debugging si falla MP
            if preference_response["status"] not in [200, 201]:
                pago.delete() # Limpiamos el pago fallido
                return Response(
                    {'error': 'Error en Mercado Pago', 'detail': preference_response}, 
                    status=500
                )

            preference = preference_response['response']
            print(preference)

            # 5. Actualizar el Pago con el ID de preferencia generado
            pago.preference_id = preference['id']
            pago.mp_data = preference # Guardamos el JSON para debug futuro
            pago.save()
            
            return Response({
                'preference_id': preference['id'],
                'init_point': preference['init_point'],
                'pago_id': pago.id,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            print("❌ ERROR CRITICO:")
            print(traceback.format_exc())
            return Response({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class WebhookView(APIView):
    """Recibe notificaciones de webhook de Mercado Pago"""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # 1. FILTRADO RÁPIDO
            topic = request.GET.get('topic') or request.GET.get('type')
            data_id = request.GET.get('data.id') or request.GET.get('id')

            if not data_id:
                body_data = request.data
                topic = body_data.get('type')
                data_id = body_data.get('data', {}).get('id')
            
            if topic != 'payment':
                return Response({'status': 'ignored'}, status=status.HTTP_200_OK)

            # 2. VALIDACIÓN DE FIRMA
            x_signature = request.headers.get("x-signature")
            x_request_id = request.headers.get("x-request-id")
            webhook_secret = os.getenv('MERCADOPAGO_WEBHOOK_SECRET')

            if webhook_secret and x_signature and x_request_id:
                parts = {}
                for part in x_signature.split(','):
                    kv = part.split('=', 1)
                    if len(kv) == 2:
                        parts[kv[0].strip()] = kv[1].strip()
                
                ts = parts.get('ts')
                v1_hash = parts.get('v1')

                if ts and v1_hash:
                    manifest = f"id:{data_id};request-id:{x_request_id};ts:{ts};"
                    hmac_obj = hmac.new(webhook_secret.encode(), msg=manifest.encode(), digestmod=hashlib.sha256)
                    local_sha = hmac_obj.hexdigest()

                    if local_sha != v1_hash:
                        return Response({'error': 'Firma inválida'}, status=status.HTTP_403_FORBIDDEN)

            # 3. CONSULTA A MERCADO PAGO
            access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
            if not access_token:
                return Response({'error': 'Credenciales no configuradas'}, status=500)

            sdk = mercadopago.SDK(access_token)
            payment_response = sdk.payment().get(data_id)
            payment_data = payment_response.get('response')

            if not payment_data or payment_response.get('status') != 200:
                return Response({'error': 'Error consultando MP'}, status=400)

            external_reference = payment_data.get('external_reference')
            if not external_reference:
                return Response({'error': 'Sin external_reference'}, status=400)

            # 4. ACTUALIZACIÓN DE BASE DE DATOS E INVENTARIO
            try:
                # Usamos transaction.atomic para que TODO (Pago + Inventario + Venta) sea atómico
                with transaction.atomic():
                    # Bloqueamos el Pago para evitar condiciones de carrera
                    pago = Pago.objects.select_for_update().get(id=int(external_reference))
                    pedido = pago.pedido 

                    # Actualizar datos informativos del pago
                    pago.payment_id = str(payment_data['id'])
                    pago.status_detail = payment_data.get('status_detail')
                    pago.mp_data = payment_data 

                    # Determinar nuevo estado
                    mp_status = payment_data.get('status')
                    nuevo_estado = Pago.EstadoChoices.PENDIENTE
                    
                    if mp_status == 'approved':
                        nuevo_estado = Pago.EstadoChoices.APROBADO
                    elif mp_status == 'rejected':
                        nuevo_estado = Pago.EstadoChoices.RECHAZADO
                    elif mp_status == 'cancelled':
                        nuevo_estado = Pago.EstadoChoices.CANCELADO
                    elif mp_status == 'refunded':
                        nuevo_estado = Pago.EstadoChoices.REEMBOLSADO

                    # IDEMPOTENCIA: Solo actuamos si el estado cambió
                    if pago.status != nuevo_estado:
                        pago.status = nuevo_estado
                        pago.save()
                        
                        # --- INTEGRACIÓN: PROCESAR EL PEDIDO SI ES APROBADO ---
                        if nuevo_estado == Pago.EstadoChoices.APROBADO:
                            print(f"💰 PAGO APROBADO: Pedido {pedido.id}. Iniciando proceso de inventario...")
                            try:
                                # Aquí llamamos a tu servicio externo
                                resultado = procesar_pedido_pagado(pedido.id)
                                print(f"✅ Pedido {pedido.id} procesado correctamente: {resultado.get('success')}")
                                
                            except ValueError as ve:
                                # Errores de lógica (ej. Pedido ya pagado, sin stock)
                                print(f"⚠️ Alerta de Negocio: {ve}")
                                # Opcional: Podrías querer guardar un log de error en el modelo Pago
                                
                            except Exception as e:
                                # Errores inesperados
                                print(f"❌ Error crítico procesando inventario: {e}")
                                # IMPORTANTE: Si falla el inventario, ¿queremos revertir el estado del pago?
                                # Al estar dentro de transaction.atomic(), si lanzamos raise, se revierte todo.
                                # Pero MP ya cobró. Lo mejor es NO revertir el pago, pero alertar al admin.
                                # Por eso capturamos la excepción aquí y no dejamos que suba.

            except (Pago.DoesNotExist, ValueError):
                return Response({'error': 'Pago local no encontrado'}, status=404)

            return Response({'status': 'ok'}, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print(f"❌ Error crítico en webhook: {str(e)}")
            return Response({'error': 'Internal server error'}, status=500)


class ConsultarPagoView(APIView):
    """Consulta el estado de un pago"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pago_id):
        """Obtiene información de un pago específico"""
        pago = get_object_or_404(Pago, id=pago_id, usuario=request.user)
        serializer = PagoSerializer(pago)
        return Response(serializer.data, status=status.HTTP_200_OK)