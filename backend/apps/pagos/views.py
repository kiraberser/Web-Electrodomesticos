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


class ProcesarPagoCardView(APIView):
    """Procesa pago con tarjeta via Card Brick de Mercado Pago"""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
            if not access_token:
                return Response({'error': 'MERCADOPAGO_ACCESS_TOKEN faltante'}, status=500)

            sdk = mercadopago.SDK(access_token)

            pedido_id = request.data.get('pedido_id')
            token = request.data.get('token')
            payment_method_id = request.data.get('payment_method_id')
            issuer_id = request.data.get('issuer_id')
            installments = request.data.get('installments', 1)
            payer_email = request.data.get('payer_email')

            if not all([pedido_id, token, payment_method_id, payer_email]):
                return Response({'error': 'Faltan campos requeridos: pedido_id, token, payment_method_id, payer_email'}, status=400)

            pedido = get_object_or_404(Pedido, id=pedido_id)
            if pedido.estado != Pedido.EstadoChoices.CREADO:
                return Response({'error': 'El pedido no está disponible para pago'}, status=400)

            usuario = request.user if request.user.is_authenticated else None
            pago = Pago.objects.create(
                pedido=pedido,
                usuario=usuario,
                amount=pedido.total,
                currency='MXN',
                status=Pago.EstadoChoices.PENDIENTE,
            )

            payment_data = {
                "transaction_amount": float(pedido.total),
                "token": token,
                "payment_method_id": payment_method_id,
                "installments": int(installments),
                "payer": {"email": payer_email},
            }
            if issuer_id:
                payment_data["issuer_id"] = issuer_id

            payment_response = sdk.payment().create(payment_data)

            if payment_response["status"] not in [200, 201]:
                pago.delete()
                return Response(
                    {'error': 'Error procesando el pago', 'detail': payment_response.get('response', {})},
                    status=400
                )

            payment = payment_response['response']
            pago.payment_id = str(payment['id'])
            pago.status_detail = payment.get('status_detail')
            pago.payment_method_id = payment.get('payment_method_id')
            pago.payment_type_id = payment.get('payment_type_id')
            pago.mp_data = payment

            mp_status = payment.get('status')
            if mp_status == 'approved':
                pago.status = Pago.EstadoChoices.APROBADO
                from django.utils import timezone as tz
                pago.fecha_aprobacion = tz.now()
                with transaction.atomic():
                    pedido.estado = Pedido.EstadoChoices.PAGADO
                    pedido.save(update_fields=['estado'])
                    try:
                        resultado = procesar_pedido_pagado(pedido.id)
                        print(f"✅ Pedido {pedido.id} procesado: {resultado.get('success')}")
                    except Exception as e:
                        print(f"⚠️ Error procesando inventario pedido {pedido.id}: {e}")
            elif mp_status == 'rejected':
                pago.status = Pago.EstadoChoices.RECHAZADO

            pago.save()

            return Response({
                'status': mp_status,
                'payment_id': payment['id'],
                'detail': payment.get('status_detail', ''),
                'pedido_id': pedido.id,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print("❌ ProcesarPagoCardView:", traceback.format_exc())
            return Response({'error': str(e)}, status=500)


class ProcesarPagoEfectivoView(APIView):
    """Genera referencia de pago en efectivo (OXXO, 7-Eleven) via Mercado Pago"""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
            if not access_token:
                return Response({'error': 'MERCADOPAGO_ACCESS_TOKEN faltante'}, status=500)

            sdk = mercadopago.SDK(access_token)

            pedido_id = request.data.get('pedido_id')
            payment_method_id = request.data.get('payment_method_id', 'oxxo')
            payer_email = request.data.get('payer_email')

            if not all([pedido_id, payer_email]):
                return Response({'error': 'Faltan campos requeridos: pedido_id, payer_email'}, status=400)

            pedido = get_object_or_404(Pedido, id=pedido_id)
            if pedido.estado != Pedido.EstadoChoices.CREADO:
                return Response({'error': 'El pedido no está disponible para pago'}, status=400)

            usuario = request.user if request.user.is_authenticated else None
            pago = Pago.objects.create(
                pedido=pedido,
                usuario=usuario,
                amount=pedido.total,
                currency='MXN',
                status=Pago.EstadoChoices.PENDIENTE,
            )

            payment_data = {
                "transaction_amount": float(pedido.total),
                "payment_method_id": payment_method_id,
                "payer": {"email": payer_email},
            }

            payment_response = sdk.payment().create(payment_data)

            if payment_response["status"] not in [200, 201]:
                pago.delete()
                return Response(
                    {'error': 'Error generando referencia de pago', 'detail': payment_response.get('response', {})},
                    status=400
                )

            payment = payment_response['response']
            pago.payment_id = str(payment['id'])
            pago.status_detail = payment.get('status_detail')
            pago.payment_method_id = payment_method_id
            pago.payment_type_id = 'ticket'
            pago.mp_data = payment
            pago.save()

            transaction_details = payment.get('transaction_details', {})
            voucher_url = transaction_details.get('external_resource_url', '')
            expires_at = payment.get('date_of_expiration', '')

            return Response({
                'status': payment.get('status', 'pending'),
                'payment_id': payment['id'],
                'voucher_url': voucher_url,
                'expires_at': expires_at,
                'pedido_id': pedido.id,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print("❌ ProcesarPagoEfectivoView:", traceback.format_exc())
            return Response({'error': str(e)}, status=500)


class CheckoutCardView(APIView):
    """Crea pedido + procesa pago con tarjeta en una operación.
    Si el pago es rechazado, el pedido se elimina (sin pedidos huérfanos).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        from apps.inventario.models import Inventario
        from apps.productos.models import Refaccion as RefaccionModel
        from apps.pedidos.models import PedidoItem

        try:
            access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
            if not access_token:
                return Response({'error': 'MERCADOPAGO_ACCESS_TOKEN faltante'}, status=500)

            data = request.data
            items_data = data.get('items', [])
            token = data.get('token')
            payment_method_id = data.get('payment_method_id')
            issuer_id = data.get('issuer_id')
            installments = data.get('installments', 1)
            payer_email = data.get('payer_email')

            if not items_data or not token or not payment_method_id or not payer_email:
                return Response({'error': 'Faltan campos requeridos'}, status=400)

            is_auth = request.user and request.user.is_authenticated
            shipping = {
                'calle': data.get('calle', ''),
                'ciudad': data.get('ciudad', ''),
                'estado': data.get('estado_envio', ''),
                'codigo_postal': data.get('codigo_postal', ''),
                'notas': data.get('notas', ''),
            }

            # 1. Crear pedido con items — si falla, el atomic rollback evita orphans
            try:
                with transaction.atomic():
                    if is_auth:
                        pedido = Pedido.objects.create(
                            usuario=request.user,
                            estado=Pedido.EstadoChoices.CREADO,
                            total=0,
                            direccion_snapshot=shipping,
                        )
                    else:
                        pedido = Pedido.objects.create(
                            usuario=None,
                            guest_name=data.get('guest_name', ''),
                            guest_email=data.get('guest_email', payer_email),
                            guest_phone=data.get('guest_phone', ''),
                            direccion_snapshot=shipping,
                            estado=Pedido.EstadoChoices.CREADO,
                            total=0,
                        )

                    total = 0
                    for item_data in items_data:
                        refaccion_id = item_data.get('refaccion')
                        cantidad = int(item_data.get('cantidad', 1))

                        refaccion = RefaccionModel.objects.get(id=refaccion_id)
                        inventario = Inventario.objects.filter(
                            refaccion=refaccion, cantidad__gt=0
                        ).order_by('fecha').first()

                        if not inventario or inventario.cantidad < cantidad:
                            raise ValueError(f'Stock insuficiente para {refaccion.nombre}')

                        precio_unitario = inventario.precio_unitario
                        subtotal_item = cantidad * precio_unitario
                        PedidoItem.objects.create(
                            pedido=pedido,
                            refaccion=refaccion,
                            cantidad=cantidad,
                            precio_unitario=precio_unitario,
                            subtotal=subtotal_item,
                        )
                        total += subtotal_item

                    pedido.total = total
                    pedido.save(update_fields=['total'])

            except RefaccionModel.DoesNotExist:
                return Response({'error': 'Producto no encontrado'}, status=400)
            except ValueError as e:
                return Response({'error': str(e)}, status=400)

            # 2. Procesar pago con tarjeta via MP
            sdk = mercadopago.SDK(access_token)
            usuario = request.user if is_auth else None

            pago = Pago.objects.create(
                pedido=pedido,
                usuario=usuario,
                amount=pedido.total,
                currency='MXN',
                status=Pago.EstadoChoices.PENDIENTE,
            )

            payment_payload = {
                "transaction_amount": float(pedido.total),
                "token": token,
                "payment_method_id": payment_method_id,
                "installments": int(installments),
                "payer": {"email": payer_email},
            }
            if issuer_id:
                payment_payload["issuer_id"] = issuer_id

            payment_response = sdk.payment().create(payment_payload)

            if payment_response["status"] not in [200, 201]:
                pago.delete()
                pedido.delete()
                return Response({'error': 'Error procesando el pago'}, status=400)

            payment = payment_response['response']
            mp_status = payment.get('status')

            if mp_status == 'rejected':
                # Pago rechazado → eliminar pedido y pago (sin pedidos huérfanos)
                with transaction.atomic():
                    pago.delete()
                    pedido.delete()
                return Response({
                    'status': 'rejected',
                    'detail': payment.get('status_detail', 'rejected'),
                }, status=status.HTTP_200_OK)

            # Aprobado o pendiente → guardar pago
            pago.payment_id = str(payment['id'])
            pago.status_detail = payment.get('status_detail')
            pago.payment_method_id = payment.get('payment_method_id')
            pago.payment_type_id = payment.get('payment_type_id')
            pago.mp_data = payment

            if mp_status == 'approved':
                pago.status = Pago.EstadoChoices.APROBADO
                from django.utils import timezone as tz
                pago.fecha_aprobacion = tz.now()
                with transaction.atomic():
                    pedido.estado = Pedido.EstadoChoices.PAGADO
                    pedido.save(update_fields=['estado'])
                    try:
                        procesar_pedido_pagado(pedido.id)
                    except Exception as e:
                        print(f"⚠️ Error procesando inventario pedido {pedido.id}: {e}")

            pago.save()

            return Response({
                'status': mp_status,
                'payment_id': payment['id'],
                'detail': payment.get('status_detail', ''),
                'pedido_id': pedido.id,
                'total': str(pedido.total),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print("❌ CheckoutCardView:", traceback.format_exc())
            return Response({'error': str(e)}, status=500)


class CheckoutEfectivoView(APIView):
    """Crea pedido + genera ticket de pago en efectivo (OXXO/7-Eleven) atómicamente."""
    permission_classes = [AllowAny]

    def post(self, request):
        from apps.inventario.models import Inventario
        from apps.productos.models import Refaccion as RefaccionModel
        from apps.pedidos.models import PedidoItem

        try:
            access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
            if not access_token:
                return Response({'error': 'MERCADOPAGO_ACCESS_TOKEN faltante'}, status=500)

            data = request.data
            items_data = data.get('items', [])
            payment_method_id = data.get('payment_method_id', 'oxxo')
            payer_email = data.get('payer_email')

            if not items_data or not payer_email:
                return Response({'error': 'Faltan campos requeridos'}, status=400)

            is_auth = request.user and request.user.is_authenticated
            shipping = {
                'calle': data.get('calle', ''),
                'ciudad': data.get('ciudad', ''),
                'estado': data.get('estado_envio', ''),
                'codigo_postal': data.get('codigo_postal', ''),
                'notas': data.get('notas', ''),
            }

            try:
                with transaction.atomic():
                    if is_auth:
                        pedido = Pedido.objects.create(
                            usuario=request.user,
                            estado=Pedido.EstadoChoices.CREADO,
                            total=0,
                            direccion_snapshot=shipping,
                        )
                    else:
                        pedido = Pedido.objects.create(
                            usuario=None,
                            guest_name=data.get('guest_name', ''),
                            guest_email=data.get('guest_email', payer_email),
                            guest_phone=data.get('guest_phone', ''),
                            direccion_snapshot=shipping,
                            estado=Pedido.EstadoChoices.CREADO,
                            total=0,
                        )

                    total = 0
                    for item_data in items_data:
                        refaccion_id = item_data.get('refaccion')
                        cantidad = int(item_data.get('cantidad', 1))

                        refaccion = RefaccionModel.objects.get(id=refaccion_id)
                        inventario = Inventario.objects.filter(
                            refaccion=refaccion, cantidad__gt=0
                        ).order_by('fecha').first()

                        if not inventario or inventario.cantidad < cantidad:
                            raise ValueError(f'Stock insuficiente para {refaccion.nombre}')

                        precio_unitario = inventario.precio_unitario
                        subtotal_item = cantidad * precio_unitario
                        PedidoItem.objects.create(
                            pedido=pedido,
                            refaccion=refaccion,
                            cantidad=cantidad,
                            precio_unitario=precio_unitario,
                            subtotal=subtotal_item,
                        )
                        total += subtotal_item

                    pedido.total = total
                    pedido.save(update_fields=['total'])

            except RefaccionModel.DoesNotExist:
                return Response({'error': 'Producto no encontrado'}, status=400)
            except ValueError as e:
                return Response({'error': str(e)}, status=400)

            # 2. Generar ticket OXXO/7-Eleven via MP
            sdk = mercadopago.SDK(access_token)
            usuario = request.user if is_auth else None

            pago = Pago.objects.create(
                pedido=pedido,
                usuario=usuario,
                amount=pedido.total,
                currency='MXN',
                status=Pago.EstadoChoices.PENDIENTE,
            )

            payment_payload = {
                "transaction_amount": float(pedido.total),
                "payment_method_id": payment_method_id,
                "payer": {"email": payer_email},
            }

            payment_response = sdk.payment().create(payment_payload)

            if payment_response["status"] not in [200, 201]:
                pago.delete()
                pedido.delete()
                return Response({'error': 'Error generando referencia de pago'}, status=400)

            payment = payment_response['response']
            pago.payment_id = str(payment['id'])
            pago.status_detail = payment.get('status_detail')
            pago.payment_method_id = payment_method_id
            pago.payment_type_id = 'ticket'
            pago.mp_data = payment
            pago.save()

            transaction_details = payment.get('transaction_details', {})
            voucher_url = transaction_details.get('external_resource_url', '')
            expires_at = payment.get('date_of_expiration', '')

            return Response({
                'status': 'pending',
                'payment_id': payment['id'],
                'voucher_url': voucher_url,
                'expires_at': expires_at,
                'pedido_id': pedido.id,
                'total': str(pedido.total),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print("❌ CheckoutEfectivoView:", traceback.format_exc())
            return Response({'error': str(e)}, status=500)


class ConsultarPagoView(APIView):
    """Consulta el estado de un pago"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pago_id):
        """Obtiene información de un pago específico"""
        pago = get_object_or_404(Pago, id=pago_id, usuario=request.user)
        serializer = PagoSerializer(pago)
        return Response(serializer.data, status=status.HTTP_200_OK)