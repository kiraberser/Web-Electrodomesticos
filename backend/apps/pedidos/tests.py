from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from apps.productos.models import Refaccion, Categoria


class CheckoutFlowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username='buyer', password='secret')
        self.categoria = Categoria.objects.create(nombre='Cat', descripcion='')
        self.ref = Refaccion.objects.create(
            codigo_parte='CP-1', nombre='Ref1', descripcion='', marca='Marca1', categoria=self.categoria,
            precio=150, existencias=10, compatibilidad=''
        )

    def test_checkout_auth_required(self):
        url = reverse('pedidos:checkout')
        res = self.client.post(url, data={"items": [{"refaccion": self.ref.id, "cantidad": 2}]}, format='json')
        self.assertEqual(res.status_code, 401)

    def test_checkout_crea_pedido_y_movimientos(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('pedidos:checkout')
        res = self.client.post(url, data={"items": [{"refaccion": self.ref.id, "cantidad": 3}]}, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertIn('pedido_id', res.data)
        self.assertIn('movimientos', res.data)

    def test_mis_pedidos_lista_solo_del_usuario(self):
        self.client.force_authenticate(user=self.user)
        url_checkout = reverse('pedidos:checkout')
        self.client.post(url_checkout, data={"items": [{"refaccion": self.ref.id, "cantidad": 1}]}, format='json')

        # Otro usuario
        other = self.User.objects.create_user(username='other', password='x')
        self.client.force_authenticate(user=other)
        url_mis = reverse('pedidos:mis_pedidos')
        res_other = self.client.get(url_mis)
        self.assertEqual(res_other.status_code, 200)
        self.assertEqual(len(res_other.data), 0)

        # Volver al usuario original
        self.client.force_authenticate(user=self.user)
        res_self = self.client.get(url_mis)
        self.assertEqual(res_self.status_code, 200)
        self.assertGreaterEqual(len(res_self.data), 1)

# Create your tests here.
