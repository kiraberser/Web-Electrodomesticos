import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/display/Card'
import { Button } from '@/shared/ui/forms/Button'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { company } from '@/shared/data/company'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
    title: 'Contacto',
    description: 'Contáctanos en Martínez de la Torre, Veracruz. Tel: +232 32 16694. Email: vega2012@live.com.mx.',
}

export default function ContactPage() {
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
                                            <p className="text-gray-600">{company.address}</p>
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
                                            <p className="text-gray-600 text-sm">{company.hours}</p>
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

                    {/* Contact Form — Client Component */}
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}
