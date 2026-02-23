import dynamic from 'next/dynamic'
import { slides } from '@/shared/data/carouselData'
import { getDealProducts, getBestSellers, getNewArrivals } from '@/shared/data/products'
import { getHomepageProducts } from '@/features/home/api'
import TrustBar from '@/features/home/TrustBar'
import BrandsBar from '@/features/home/BrandsBar'
import RepairBlogSection from '@/features/home/RepairBlogSection'
import FadeInSection from '@/features/home/FadeInSection'

const HeroCarousel = dynamic(
  () => import('@/features/home/HeroCarousel'),
  { loading: () => <div className="h-[280px] md:h-[420px] lg:h-[480px] animate-pulse bg-gray-100" /> },
)

const CategoryStrip = dynamic(
  () => import('@/features/home/CategoryStrip'),
  { loading: () => <div className="h-80 animate-pulse bg-gray-50" /> },
)

const DealsSection = dynamic(
  () => import('@/features/home/DealsSection'),
  { loading: () => <div className="h-96 animate-pulse bg-gray-50" /> },
)

const SloganBanner = dynamic(
  () => import('@/features/home/SloganBanner'),
  { loading: () => <div className="h-[280px] md:h-[320px] animate-pulse bg-[#0A3981]" /> },
)

const FeaturedGrid = dynamic(
  () => import('@/features/home/FeaturedGrid'),
  { loading: () => <div className="h-80 animate-pulse bg-white" /> },
)

const ProductRow = dynamic(
  () => import('@/features/home/ProductRow'),
  { loading: () => <div className="h-96 animate-pulse bg-white" /> },
)

export const metadata = {
  title: 'Refaccionaria Vega - Electrodomésticos y Refacciones',
  description: 'Encuentra las mejores refacciones y electrodomésticos para tu hogar. Calidad garantizada y envíos a toda la república mexicana.',
}

export default async function HomePage() {
  // Fetch from API with hardcoded fallback
  const apiProducts = await getHomepageProducts()

  const deals = apiProducts.deals.length > 0 ? apiProducts.deals : getDealProducts()
  const bestSellers = apiProducts.bestSellers.length > 0 ? apiProducts.bestSellers : getBestSellers()
  const newArrivals = apiProducts.newArrivals.length > 0 ? apiProducts.newArrivals : getNewArrivals()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Refaccionaria Vega',
    description: 'Refacciones y electrodomésticos de calidad en Martínez de la Torre, Veracruz.',
    url: 'https://refaccionariavega.com',
    telephone: '+52-232-324-0000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Martínez de la Torre',
      addressLocality: 'Martínez de la Torre',
      addressRegion: 'Veracruz',
      addressCountry: 'MX',
    },
    priceRange: '$$',
    openingHours: 'Mo-Sa 09:00-19:00',
    sameAs: [],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Banners promocionales */}
      <HeroCarousel slides={slides} />

      <FadeInSection>
        <TrustBar />
      </FadeInSection>

      {/* 2. Categorías — carousel infinito */}
      <FadeInSection>
        <CategoryStrip />
      </FadeInSection>

      {/* 3. Ofertas del día con countdown */}
      <FadeInSection>
        <DealsSection products={deals} />
      </FadeInSection>

      {/* 4. Identidad de marca */}
      <SloganBanner />

      {/* 5. Más vendidos — ranked grid */}
      <FadeInSection>
        <FeaturedGrid
          title="Los Más Vendidos"
          products={bestSellers}
          viewAllHref="/categorias"
        />
      </FadeInSection>

      {/* 6. Beneficios */}

      {/* 7. Blog — editorial layout */}
      <FadeInSection>
        <RepairBlogSection />
      </FadeInSection>

      {/* 9. Marcas */}
      <FadeInSection>
        <BrandsBar />
      </FadeInSection>
    </main>
  )
}
