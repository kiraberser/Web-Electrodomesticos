import { Card, CardContent } from '@/components/ui/display/Card';
import { Truck, Shield, Wrench, Headphones, Loader2 } from 'lucide-react';

import { company } from '@/data/company';
import { features_data as features } from '@/data/features';

const Features = () => {

    const iconMap = {
        Truck,
        Shield,
        Wrench,
        Headphones,
    };

    return (
        <section className="py-16 bg-blue-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¿Por qué elegirnos?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Ofrecemos los mejores servicios y garantías para tu tranquilidad
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => {
                        const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Truck;
                        return (
                            <Card
                                key={feature.id}
                                className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                                        <IconComponent className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {company?.description || 'Más de 20 años ofreciendo los mejores electrodomésticos con la mejor calidad y servicio.'}
                        </h3>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span>Más de 20 años de experiencia</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span>Servicio técnico certificado</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                                <span>Garantía en todos nuestros productos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;