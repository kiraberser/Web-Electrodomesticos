'use client'

import React, { useState } from 'react';

import { Button } from '@/components/ui/forms/Button';
import { Input } from '@/components/ui/forms/InputField';
import { Label } from '@/components/ui/forms/Label';
import { Textarea } from '@/components/ui/display/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/Card'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/display/Select'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from '@/hook/use-toast'
import { company } from '@/data/company';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        priority: 'normal'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            toast({
                title: "Mensaje enviado",
                description: "Gracias por contactarnos. Te responderemos pronto.",
            });
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                ¡Mensaje Enviado!
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Gracias por contactarnos. Hemos recibido tu mensaje y nuestro equipo te responderá en las próximas 24 horas.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => setIsSubmitted(false)} variant="outline" >
                                    Enviar otro mensaje
                                </Button>
                                <Button onClick={() => window.location.href = '/'}>
                                    Volver al inicio
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Contáctanos
                        </h1>
                        <p className="text-xl text-blue-100">
                            Estamos aquí para ayudarte. No dudes en contactarnos para cualquier pregunta o consulta.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle className="text-xl">Información de Contacto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Dirección</h4>
                                            <p className="text-gray-600">
                                                {company.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Teléfono</h4>
                                            <p className="text-gray-600">{company.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Email</h4>
                                            <p className="text-gray-600">{company.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Horarios</h4>
                                            <div className="text-gray-600 text-sm">
                                                <p>{company.hours}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Contact Options */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Contacto Rápido</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button className="w-full" variant="outline">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Llamar Ahora
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Enviar Email
                                    </Button>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">¿Necesitas ayuda inmediata?</p>
                                        <p className="text-lg font-semibold text-blue-600">
                                            Chat en vivo disponible
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
                                <p className="text-gray-600">
                                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="name">Nombre Completo *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                placeholder="Tu nombre completo"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Correo Electrónico *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="phone">Teléfono</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                placeholder="+52 55 1234 5678"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="priority">Prioridad</Label>
                                            <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona la prioridad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Baja</SelectItem>
                                                    <SelectItem value="normal">Normal</SelectItem>
                                                    <SelectItem value="high">Alta</SelectItem>
                                                    <SelectItem value="urgent">Urgente</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Asunto *</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => handleChange('subject', e.target.value)}
                                            placeholder="¿En qué podemos ayudarte?"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Mensaje *</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => handleChange('message', e.target.value)}
                                            placeholder="Describe tu consulta o mensaje..."
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="rounded border-gray-300"
                                            required
                                        />
                                        <Label htmlFor="terms" className="text-sm text-gray-600">
                                            Acepto los términos y condiciones y la política de privacidad
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full text-white h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2 text-white" />
                                                <span className='text-white'>Enviar Mensaje</span>
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="text-xl">Preguntas Frecuentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            ¿Cuál es el tiempo de respuesta?
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Normalmente respondemos en un plazo de 24 horas durante días hábiles.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            ¿Ofrecen servicio técnico?
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Sí, contamos con servicio técnico especializado para todos nuestros productos.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            ¿Tienen garantía en sus productos?
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Todos nuestros productos incluyen garantía del fabricante y garantía extendida opcional.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;