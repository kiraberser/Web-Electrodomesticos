import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../forms/Button';
import { Input } from '../forms/InputField';
import { Label } from '../forms/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../display/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../display/Card';
import { Badge } from '../feedback/Badge';
import { Separator } from '../display/Separator';

const AccountModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Mock user data
    const userData = {
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        phone: '+52 55 1234 5678',
        address: 'Av. Insurgentes Sur 123, Ciudad de México'
    };

    // Mock orders data
    const orders = [
        {
            id: 'ORD-001',
            date: '2024-01-15',
            total: 899.99,
            status: 'Entregado',
            items: ['Refrigerador Samsung 25 pies', 'Microondas Panasonic']
        },
        {
            id: 'ORD-002',
            date: '2024-01-10',
            total: 649.99,
            status: 'En tránsito',
            items: ['Lavadora LG 18kg']
        }
    ];

    // Mock wishlist data
    const wishlist = [
        {
            id: 1,
            name: 'Aire Acondicionado Carrier',
            price: 499.99,
            image: 'https://images.unsplash.com/photo-1631201222066-8e5d3e5a7d6c?w=100&h=100&fit=crop'
        },
        {
            id: 2,
            name: 'Estufa Whirlpool',
            price: 349.99,
            image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=100&h=100&fit=crop'
        }
    ];

    const handleLogout = () => {
        setIsLoggedIn(false);
        setActiveTab('profile');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Entregado':
                return 'bg-green-100 text-green-800';
            case 'En tránsito':
                return 'bg-blue-100 text-blue-800';
            case 'Procesando':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Mi Cuenta
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {!isLoggedIn ? (
                            <div className="max-w-md mx-auto text-center">
                                <div className="mb-8">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Inicia sesión en tu cuenta
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Accede a tu cuenta para ver tus pedidos, lista de deseos y configuración
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Link href="/auth" onClick={onClose}>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            Iniciar Sesión
                                        </Button>
                                    </Link>

                                    <Link href="/auth" onClick={onClose}>
                                        <Button variant="outline" className="w-full">
                                            Crear Cuenta Nueva
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Beneficios de tener una cuenta
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Seguimiento de pedidos en tiempo real</li>
                                        <li>• Lista de deseos personalizada</li>
                                        <li>• Historial de compras</li>
                                        <li>• Ofertas exclusivas</li>
                                        <li>• Checkout más rápido</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="profile">
                                        <User className="w-4 h-4 mr-2" />
                                        Perfil
                                    </TabsTrigger>
                                    <TabsTrigger value="orders">
                                        <Package className="w-4 h-4 mr-2" />
                                        Pedidos
                                    </TabsTrigger>
                                    <TabsTrigger value="wishlist">
                                        <Heart className="w-4 h-4 mr-2" />
                                        Lista de Deseos
                                    </TabsTrigger>
                                    <TabsTrigger value="settings">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configuración
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="profile" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Información Personal</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="profile-name">Nombre Completo</Label>
                                                    <Input
                                                        id="profile-name"
                                                        value={userData.name}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="profile-email">Correo Electrónico</Label>
                                                    <Input
                                                        id="profile-email"
                                                        type="email"
                                                        value={userData.email}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="profile-phone">Teléfono</Label>
                                                    <Input
                                                        id="profile-phone"
                                                        value={userData.phone}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="profile-address">Dirección</Label>
                                                    <Input
                                                        id="profile-address"
                                                        value={userData.address}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline">Editar Perfil</Button>
                                                <Button variant="outline" onClick={handleLogout}>
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Cerrar Sesión
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="orders" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Historial de Pedidos</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {orders.map((order) => (
                                                    <div key={order.id} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-semibold">Pedido #{order.id}</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    Fecha: {new Date(order.date).toLocaleDateString('es-ES')}
                                                                </p>
                                                            </div>
                                                            <Badge className={getStatusColor(order.status)}>
                                                                {order.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="mb-2">
                                                            <p className="text-sm font-medium">Productos:</p>
                                                            <ul className="text-sm text-gray-600">
                                                                {order.items.map((item, index) => (
                                                                    <li key={index}>• {item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-semibold">
                                                                Total: {formatPrice(order.total)}
                                                            </span>
                                                            <Button variant="outline" size="sm">
                                                                Ver Detalles
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="wishlist" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Lista de Deseos</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {wishlist.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-md"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-medium">{item.name}</h4>
                                                            <p className="text-lg font-semibold text-blue-600">
                                                                {formatPrice(item.price)}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                                                Agregar al Carrito
                                                            </Button>
                                                            <Button variant="outline" size="sm">
                                                                Quitar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="settings" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Configuración de Cuenta</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Notificaciones</h4>
                                                <div className="space-y-2">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="checkbox" className="rounded" defaultChecked />
                                                        <span>Recibir ofertas y promociones</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="checkbox" className="rounded" defaultChecked />
                                                        <span>Notificaciones de pedidos</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="checkbox" className="rounded" />
                                                        <span>Newsletter semanal</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h4 className="font-medium mb-2">Seguridad</h4>
                                                <div className="space-y-2">
                                                    <Button variant="outline">Cambiar Contraseña</Button>
                                                    <Button variant="outline">Autenticación de Dos Factores</Button>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h4 className="font-medium mb-2">Privacidad</h4>
                                                <div className="space-y-2">
                                                    <Button variant="outline">Descargar Datos</Button>
                                                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                                                        Eliminar Cuenta
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountModal;