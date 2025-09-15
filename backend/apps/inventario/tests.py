from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db import transaction
from django.urls import reverse
from rest_framework.test import APIClient

from apps.productos.models import Refaccion, Categoria
from apps.inventario.models import Inventario
from apps.inventario.services import registrar_salida_por_compra


class InventarioFlowsTest(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username='u', password='p')
        self.categoria = Categoria.objects.create(nombre='Cat', descripcion='')
        self.ref = Refaccion.objects.create(
            codigo_parte='X1', nombre='Ref', descripcion='', marca='MarcaX', categoria=self.categoria,
            precio=100, existencias=10, compatibilidad=''
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_entrada_inicial_signal_removed_but_service_from_serializer(self):
        # Simula creación desde serializer: ya probado en productos serializer, aquí validamos movimientos
        # Creamos una entrada manual
        mov = Inventario.objects.create(
            refaccion=self.ref, cantidad=5, precio_unitario=100, tipo_movimiento=Inventario.TipoMovimientoChoices.ENTRADA
        )
        self.ref.refresh_from_db()
        self.assertEqual(self.ref.existencias, 15)

    def test_salida_por_compra_actualiza_stock(self):
        registrar_salida_por_compra(self.ref, 3)
        self.ref.refresh_from_db()
        self.assertEqual(self.ref.existencias, 7)

    def test_salida_stock_insuficiente(self):
        with self.assertRaises(Exception):
            registrar_salida_por_compra(self.ref, 999)

    def test_endpoint_devolucion(self):
        # Hacemos una salida previa
        registrar_salida_por_compra(self.ref, 2)
        url = reverse('inventario-devolucion')
        res = self.client.post(url, data={"refaccion": self.ref.id, "cantidad": 1}, format='json')
        self.assertEqual(res.status_code, 201)
        self.ref.refresh_from_db()
        # Stock: 10 - 2 + 1 = 9
        self.assertEqual(self.ref.existencias, 9)

# Create your tests here.
