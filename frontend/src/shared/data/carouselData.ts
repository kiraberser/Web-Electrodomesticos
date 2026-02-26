export interface HeroSlide {
  id: number
  image: string
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  bgColor: string
}

export const slides: HeroSlide[] = [
  {
    id: 1,
    image: '/images/hero/minisplit.webp',
    title: 'No sufras de calor en esta temporada!',
    subtitle: 'Instalación de minisplit en tú hogar.',
    ctaText: 'Ver ofertas',
    ctaHref: '/categorias',
    bgColor: '#0A3981',
  },
  {
    id: 2,
    image: '/images/hero/ElectrodomesticosHero.webp',
    title: 'Repuestos Originales',
    subtitle: 'Garantía y calidad para tus electrodomésticos. Más de 500 productos disponibles.',
    ctaText: 'Explorar catálogo',
    ctaHref: '/categorias',
    bgColor: '#1a4a8f',
  },
  {
    id: 3,
    image: '/images/hero/envios.webp',
    title: 'Envío Gratis',
    subtitle: 'En compras mayores a $800. Envíos seguros a toda la república.',
    ctaText: 'Comprar ahora',
    ctaHref: '/categorias',
    bgColor: '#E38E49',
  },
]
