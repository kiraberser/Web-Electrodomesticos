import Image from 'next/image';

import Logo from '@/../public/assets/Logo.png'

import { Button } from '../forms/Button';
import { Separator } from '../display/Separator';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { company } from '@/data/company';
import { categories } from '@/data/category';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Suscríbete a nuestro newsletter
            </h3>
            <p className="text-blue-100 mb-6">
              Recibe las mejores ofertas y novedades directamente en tu correo
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 px-6 py-3">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image
                  src={Logo}
                  alt={'Logo Refaccionaria Vega'}
                  width={50}
                  height={50}
                />
                <div>
                  <h3 className="text-xl font-bold">{company?.name || 'ElectroMart'}</h3>
                  <p className="text-sm text-gray-400">{company?.tagline || 'Tu hogar, nuestra pasión'}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {company?.description || 'Más de 20 años ofreciendo los mejores electrodomésticos con la mejor calidad y servicio.'}
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Categorías</h4>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Entrega e instalación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Servicio técnico
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Garantía extendida
                  </Link>
                </li>
                <li>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Devoluciones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Soporte
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-400">{company?.phone || '+52 55 1234 5678'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-400">{company?.email || 'info@electromart.com'}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-500 mt-1" />
                  <span className="text-gray-400">{company?.address || 'Av. Insurgentes Sur 123, Ciudad de México'}</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h5 className="font-semibold text-sm mb-2">Horarios de atención</h5>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Lun - Vie: 9:00 AM - 7:00 PM</div>
                  <div>Sábado: 9:00 AM - 5:00 PM</div>
                  <div>Domingo: 10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {company?.name || 'ElectroMart'}. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos y condiciones
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de privacidad
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Aviso legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;