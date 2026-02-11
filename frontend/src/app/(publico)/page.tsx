import dynamic from 'next/dynamic'
import { slides } from '@/data/carouselData'
import { getDealProducts, getBestSellers, getNewArrivals } from '@/data/products'
import CategoryStrip from '@/components/home/CategoryStrip'
import DealsSection from '@/components/home/DealsSection'
import ProductRow from '@/components/home/ProductRow'
import TrustBar from '@/components/home/TrustBar'
import Brands from '@/components/product/Brands'

const HeroCarousel = dynamic(
  () => import('@/components/home/HeroCarousel'),
  { loading: () => <div className="h-[280px] md:h-[420px] lg:h-[480px] animate-pulse bg-gray-100" /> },
)

const Reviews = dynamic(
  () => import('@/components/features/reviews/Reviews').then((m) => ({ default: m.Reviews })),
  { loading: () => <section className="py-12"><div className="container mx-auto px-4"><div className="h-64 animate-pulse bg-gray-100 rounded-xl" /></div></section> },
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
      <HeroCarousel slides={slides} />
      <CategoryStrip />
      <DealsSection products={deals} />
      <ProductRow
        title="Más Vendidos"
        products={bestSellers}
        viewAllHref="/categorias"
      />
      <ProductRow
        title="Recién Llegados"
        products={newArrivals}
        viewAllHref="/categorias"
        badge="Nuevo"
      />
      <TrustBar />
      <Reviews />
      <Brands />
    </main>
  )
}
