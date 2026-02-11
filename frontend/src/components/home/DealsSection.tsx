import dynamic from 'next/dynamic'
import { Flame } from 'lucide-react'
import ProductCardMini from '@/components/home/ProductCardMini'
import type { Product } from '@/data/products'

const CountdownTimer = dynamic(
  () => import('@/components/home/CountdownTimer'),
  { loading: () => <div className="h-6 w-40 animate-pulse bg-gray-100 rounded" /> },
)

interface DealsSectionProps {
  products: Product[]
}

function getDealEndTime(): string {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return end.toISOString()
}

export default function DealsSection({ products }: DealsSectionProps) {
  if (products.length === 0) return null

  const dealEnd = getDealEndTime()

  return (
    <section className="py-8 bg-[#FAFBFC]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#E38E49]" />
            <h2 className="text-2xl font-bold text-gray-900">Ofertas del Día</h2>
          </div>
          <CountdownTimer targetDate={dealEnd} />
        </div>

        {/* Product scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => (
            <ProductCardMini
              key={product.id}
              product={product}
              showDiscount
            />
          ))}
        </div>
      </div>
    </section>
  )
}
