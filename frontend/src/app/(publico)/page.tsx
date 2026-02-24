import dynamic from 'next/dynamic'
import { slides } from '@/shared/data/carouselData'
import { getDealProducts, getBestSellers, getNewArrivals } from '@/shared/data/products'
import { getHomepageProducts } from '@/features/home/api'
import TrustBar from '@/features/home/TrustBar'
import BrandsBar from '@/features/home/BrandsBar'
import RepairBlogSection from '@/features/home/RepairBlogSection'
import FadeInSection from '@/features/home/FadeInSection'
import { company } from '@/shared/data/company'

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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: company.name,
  description: company.description,
  url: 'https://refaccionariavega.com',
  telephone: '+522323216694',
  image: 'https://refaccionariavega.com/logo.png',
  priceRange: '$$',
  currenciesAccepted: 'MXN',
  paymentAccepted: 'Efectivo, Tarjeta de crédito, Tarjeta de débito',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Col. Centro, Frente a Dominios',
    addressLocality: 'Martínez de la Torre',
    addressRegion: 'Veracruz de Ignacio de la Llave',
    postalCode: '93600',
    addressCountry: 'MX',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '20.0667',
    longitude: '-97.0500',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '14:00',
    },
  ],
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Refaccionaria Vega',
  url: 'https://refaccionariavega.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://refaccionariavega.com/categorias?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export const metadata = {
  title: 'Refaccionaria Vega — Refacciones y Electrodomésticos',
  description: 'Refacciones y electrodomésticos de calidad en Martínez de la Torre, Veracruz. Envío a toda la república.',
}

export default async function HomePage() {
  // Fetch from API with hardcoded fallback
  const apiProducts = await getHomepageProducts()

  const deals = apiProducts.deals.length > 0 ? apiProducts.deals : getDealProducts()
  const bestSellers = apiProducts.bestSellers.length > 0 ? apiProducts.bestSellers : getBestSellers()
  const newArrivals = apiProducts.newArrivals.length > 0 ? apiProducts.newArrivals : getNewArrivals()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <h1 className="sr-only">
        Refacciones para Electrodomésticos en Martínez de la Torre, Veracruz
      </h1>

      {/* 1. Banners promocionales */}
      <HeroCarousel slides={slides} />

      <TrustBar />

      {/* 2. Categorías — carousel infinito */}
      <CategoryStrip />

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
