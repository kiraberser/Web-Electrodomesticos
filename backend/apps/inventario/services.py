from django.db import transaction

from apps.inventario.models import Inventario
from apps.productos.models import Marca, Refaccion


def registrar_entrada_inicial_refaccion(refaccion: Refaccion, cantidad_inicial: int) -> None:
    """Crea un movimiento ENTRADA inicial para una refacción recién creada.

    - Evita el doble conteo llevando existencias a 0 antes de crear la entrada.
    - Resuelve la relación de marca (FK) a partir del nombre en la refacción.
    """
    if not cantidad_inicial or cantidad_inicial <= 0:
        return

    with transaction.atomic():
        # Llevar existencias a 0 para evitar doble conteo
        Refaccion.objects.filter(pk=refaccion.pk).update(existencias=0)

        # Resolver Marca (Refaccion.marca es CharField)
        marca_obj = None
        try:
            if isinstance(refaccion.marca, str):
                marca_obj, _ = Marca.objects.get_or_create(nombre=refaccion.marca)
            else:
                marca_obj = refaccion.marca
        except Exception:
            marca_obj = None

        Inventario.objects.create(
            refaccion=refaccion,
            cantidad=cantidad_inicial,
            precio_unitario=refaccion.precio,
            marca=marca_obj,
            categoria=refaccion.categoria,
            tipo_movimiento=Inventario.TipoMovimientoChoices.ENTRADA,
        )

        # Refrescar el valor de existencias en memoria
        try:
            refaccion.refresh_from_db(fields=['existencias'])
        except Exception:
            pass


def registrar_salida_por_compra(refaccion: Refaccion, cantidad: int, precio_unitario=None) -> Inventario:
    """Registra una SALIDA de inventario por compra segura con validación de stock."""
    
    if not cantidad or cantidad <= 0:
        raise ValueError("La cantidad debe ser mayor a cero.")

    with transaction.atomic():
        # 1. Bloqueo pesimista (Esto está perfecto en tu código original)
        ref = Refaccion.objects.select_for_update().get(pk=refaccion.pk)
        
        # Resolver marca (Tu lógica original)
        marca_obj = None
        try:
            if isinstance(ref.marca, str):
                marca_obj, _ = Marca.objects.get_or_create(nombre=ref.marca)
            else:
                marca_obj = ref.marca
        except Exception:
            marca_obj = None

        # 2. Instanciar el objeto SIN guardarlo todavía
        movimiento = Inventario(
            refaccion=ref,
            cantidad=cantidad,
            precio_unitario=precio_unitario if precio_unitario is not None else ref.precio,
            marca=marca_obj,
            categoria=ref.categoria,
            tipo_movimiento=Inventario.TipoMovimientoChoices.SALIDA,
        )

        # 3. ### CORRECCIÓN CRÍTICA ###
        # Forzamos la validación. Esto ejecutará tu método .clean() del modelo Inventario
        # Si no hay stock, esto lanzará ValidationError
        try:
            movimiento.full_clean() 
        except Exception as e:
            # Capturamos el error de validación y lo convertimos a ValueError para que suba limpio
            raise ValueError(f"Error de validación de inventario (Stock insuficiente?): {e}")

        # 4. Si pasa la validación, guardamos
        movimiento.save()

        # Refrescar existencias en memoria
        try:
            ref.refresh_from_db(fields=['existencias'])
        except Exception:
            pass
            
        return movimiento


def registrar_entrada_manual(refaccion: Refaccion, cantidad: int, precio_unitario=None) -> Inventario:
    """Registra una ENTRADA manual de inventario (p. ej., reposición)."""
    if not cantidad or cantidad <= 0:
        raise ValueError("La cantidad debe ser mayor a cero.")

    with transaction.atomic():
        ref = Refaccion.objects.select_for_update().get(pk=refaccion.pk)
        # Resolver marca
        marca_obj = None
        try:
            if isinstance(ref.marca, str):
                marca_obj, _ = Marca.objects.get_or_create(nombre=ref.marca)
            else:
                marca_obj = ref.marca
        except Exception:
            marca_obj = None

        movimiento = Inventario.objects.create(
            refaccion=ref,
            cantidad=cantidad,
            precio_unitario=precio_unitario if precio_unitario is not None else ref.precio,
            marca=marca_obj,
            categoria=ref.categoria,
            tipo_movimiento=Inventario.TipoMovimientoChoices.ENTRADA,
        )
        try:
            ref.refresh_from_db(fields=['existencias'])
        except Exception:
            pass
        return movimiento


def registrar_entrada_por_devolucion(refaccion: Refaccion, cantidad: int, precio_unitario=None) -> Inventario:
    """Registra una ENTRADA por devolución de una compra."""
    return registrar_entrada_manual(refaccion=refaccion, cantidad=cantidad, precio_unitario=precio_unitario)

