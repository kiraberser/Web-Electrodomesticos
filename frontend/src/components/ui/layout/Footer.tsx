"use client";

import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/data/company";
import { categories } from "@/data/category";
import Link from "next/link";
import Newsletter from "@/components/public/Newsletter";

const Footer = ({ username }: { username: string | undefined }) => {
  return (
    <footer className="bg-[#0A3981]">
      {/* Newsletter Banner */}
      {!username && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#E38E49] to-[#d47a35]">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -left-8 w-40 h-40 border-[3px] border-white rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-56 h-56 border-[3px] border-white rounded-full" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 border-[2px] border-white rounded-full" />
          </div>

          <Newsletter />
        </div>
      )}

      {/* Main Footer */}
      <div className="py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
            {/* Logo & Company */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{company.name}</h3>
                <p className="text-sm text-white/50 mt-1 italic">
                  {company.tagline}
                </p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                {company.description}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-white/70" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-white/70" />
                </a>
              </div>
            </div>

            {/* Categorías */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Categorías
              </h4>
              <ul className="space-y-2.5">
                {categories.slice(0, 7).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categorias/${encodeURIComponent(category.key)}`}
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/categorias"
                    className="text-[#E38E49] hover:text-[#E38E49]/80 text-sm font-medium transition-colors"
                  >
                    Ver todas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Soporte */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Soporte
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/contacto"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politicas-envio"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Políticas de envío
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Sobre nosotros
                  </Link>
                </li>
              </ul>
            </div>

            {/* Información Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Términos y condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-returns"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Devoluciones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Horarios & Contacto */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Horarios
              </h4>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3.5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Clock className="w-4 h-4 text-[#E38E49]" />
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                      Atención
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Lun - Vie</span>
                      <span className="text-white/80 font-medium">
                        9:00 - 19:00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Sábado</span>
                      <span className="text-white/80 font-medium">
                        9:00 - 14:00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Domingo</span>
                      <span className="text-white/40">Cerrado</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E38E49]" />
                    <span>{company.phone}</span>
                  </a>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E38E49]" />
                    <span className="truncate">{company.email}</span>
                  </a>
                  <div className="flex items-start gap-2 text-white/50">
                    <MapPin className="w-3.5 h-3.5 text-[#E38E49] mt-0.5 flex-shrink-0" />
                    <span className="text-xs leading-relaxed">
                      {company.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()}{" "}
              {company.name}. Todos los derechos reservados.
            </p>
            <p className="text-white/30 text-xs">
              Martínez de la Torre, Veracruz, México
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
