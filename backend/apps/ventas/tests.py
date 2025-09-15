from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from apps.productos.models import Refaccion, Categoria
from apps.pedidos.models import Pedido
from apps.pedidos.serializers import CheckoutSerializer
from apps.ventas.models import Devolucion
from apps.inventario.services import registrar_salida_por_compra
from apps.inventario.serializer import RegistrarDevolucionSerializer


class DevolucionesViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username='buyer', password='secret')
        self.admin = self.User.objects.create_superuser(username='admin', password='secret')
        self.categoria = Categoria.objects.create(nombre='Cat', descripcion='')
        self.ref = Refaccion.objects.create(
            codigo_parte='CP-2', nombre='Ref2', descripcion='', marca='Marca2', categoria=self.categoria,
            precio=100, existencias=10, compatibilidad=''
        )

        # Generar una venta via checkout serializer
        self.client.force_authenticate(user=self.user)
        checkout_data = {"items": [{"refaccion": self.ref.id, "cantidad": 1}]}
        serializer = CheckoutSerializer(data=checkout_data, context={'request': type('obj', (object,), {'user': self.user})})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self.client.force_authenticate(user=None)

        # Registrar una devolución
        self.client.force_authenticate(user=self.admin)
        url_dev = reverse('inventario-devolucion')
        self.client.post(url_dev, data={"refaccion": self.ref.id, "cantidad": 1}, format='json')
        self.client.force_authenticate(user=None)

    def test_usuario_ve_solo_sus_devoluciones(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('devoluciones-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        # Tiene al menos 1 devolución (la de su venta)
        self.assertGreaterEqual(len(res.data), 1)

    def test_admin_ve_todas(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('devoluciones-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.data), 1)

# Create your tests here.
