import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/feedback/Badge'
import ProductCardMini from '@/components/home/ProductCardMini'
import type { Product } from '@/data/products'

interface ProductRowProps {
  title: string
  products: Product[]
  viewAllHref?: string
  badge?: string
  showDiscount?: boolean
}

export default function ProductRow({
  title,
  products,
  viewAllHref,
  badge,
  showDiscount = false,
}: ProductRowProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {badge ? (
              <Badge className="bg-blue-50 text-[#0A3981] border-0 text-xs font-medium">
                {badge}
              </Badge>
            ) : null}
          </div>
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm font-medium text-[#0A3981] hover:text-[#E38E49] transition-colors"
            >
              Ver todo
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : null}
        </div>

        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => (
            <ProductCardMini
              key={product.id}
              product={product}
              showDiscount={showDiscount}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
