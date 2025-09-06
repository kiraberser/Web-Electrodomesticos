import { Button } from '../forms/Button';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import Image from 'next/image';

import ElectrodomesticosHero from '/public/images/hero/ElectrodomesticosHero.png'

const Hero = () => {

  if (!true) {
    return (
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Refacciones en Electrodomésticos
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Encuentra las mejores refacciones para tu hogar con la mejor garantía y servicio técnico
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Calidad Garantizada</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Protección contra defectos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Envíos a todo el país</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 transition-all duration-300 hover:scale-105"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 transition-all duration-300"
              >
                Más información
              </Button>
            </div>

            {/* Stats */}
            <div className="flex divide-x divide-gray-200 pt-6">
              <div className="pr-6">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Refacciones</div>
              </div>
              <div className="px-6">
                <div className="text-2xl font-bold text-gray-900">20+</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </div>
              <div className="pl-6">
                <div className="text-2xl font-bold text-gray-900">5k+</div>
                <div className="text-sm text-gray-600">Clientes satisfechos</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src={ElectrodomesticosHero}
                alt="Electrodomésticos de calidad"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">25%</div>
                <div className="text-sm">Descuento</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">1000+</div>
                    <div className="text-gray-500">Reseñas</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-orange-200 rounded-2xl transform rotate-6 scale-105 opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;