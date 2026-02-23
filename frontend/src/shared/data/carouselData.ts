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
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1920',
    title: 'Ofertas de Temporada',
    subtitle: 'Hasta 30% de descuento en refacciones y electrodomésticos seleccionados.',
    ctaText: 'Ver ofertas',
    ctaHref: '/categorias',
    bgColor: '#0A3981',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1748347687685-5613deb470ec?q=80&w=1920',
    title: 'Repuestos Originales',
    subtitle: 'Garantía y calidad para tus electrodomésticos. Más de 500 productos disponibles.',
    ctaText: 'Explorar catálogo',
    ctaHref: '/categorias',
    bgColor: '#1a4a8f',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1920',
    title: 'Envío Gratis',
    subtitle: 'En compras mayores a $800. Envíos seguros a toda la república.',
    ctaText: 'Comprar ahora',
    ctaHref: '/categorias',
    bgColor: '#E38E49',
  },
]
