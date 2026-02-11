import dynamic from 'next/dynamic'
import { slides } from '@/data/carouselData'
import { getDealProducts, getBestSellers, getNewArrivals } from '@/data/products'
import TrustBar from '@/components/home/TrustBar'
import RepairBlogSection from '@/components/home/RepairBlogSection'

const HeroCarousel = dynamic(
  () => import('@/components/home/HeroCarousel'),
  { loading: () => <div className="h-[280px] md:h-[420px] lg:h-[480px] animate-pulse bg-gray-100" /> },
)

const CategoryStrip = dynamic(
  () => import('@/components/home/CategoryStrip'),
  { loading: () => <div className="h-40 animate-pulse bg-gray-50" /> },
)

const DealsSection = dynamic(
  () => import('@/components/home/DealsSection'),
  { loading: () => <div className="h-96 animate-pulse bg-gray-50" /> },
)

const SloganBanner = dynamic(
  () => import('@/components/home/SloganBanner'),
  { loading: () => <div className="h-[280px] md:h-[320px] animate-pulse bg-[#0A3981]" /> },
)

const FeaturedGrid = dynamic(
  () => import('@/components/home/FeaturedGrid'),
  { loading: () => <div className="h-96 animate-pulse bg-white" /> },
)

const ProductRow = dynamic(
  () => import('@/components/home/ProductRow'),
  { loading: () => <div className="h-96 animate-pulse bg-white" /> },
)

export const metadata = {
  title: 'Refaccionaria Vega - Electrodomésticos y Refacciones',
  description: 'Encuentra las mejores refacciones y electrodomésticos para tu hogar. Calidad garantizada y envíos a toda la república mexicana.',
}

export default function HomePage() {
  const deals = getDealProducts()
  const bestSellers = getBestSellers()
  const newArrivals = getNewArrivals()

  return (
    <main>
      {/* 1. Primera impresión — banners promocionales */}
      <HeroCarousel slides={slides} />

      {/* 2. Navegación rápida — categorías */}
      <CategoryStrip />

      {/* 3. Urgencia — ofertas con countdown */}
      <DealsSection products={deals} />

      {/* 4. Identidad de marca — rompe la monotonía */}
      <SloganBanner />

      {/* 5. Social proof — grid asimétrico (1 grande + 3 chicos) */}
      <FeaturedGrid
        title="Los Más Vendidos"
        products={bestSellers}
        viewAllHref="/categorias"
      />

      {/* 6. Contenido educativo — separa secciones de productos */}
      <RepairBlogSection />

      {/* 7. Descubrimiento — carousel de novedades */}
      <ProductRow
        title="Recién Llegados"
        products={newArrivals}
        viewAllHref="/categorias"
        badge="Nuevo"
      />

      {/* 8. Confianza — features + stats + marcas fusionados */}
      <TrustBar />
    </main>
  )
}
