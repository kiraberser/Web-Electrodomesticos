import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/feedback/Badge'
import type { Product } from '@/data/products'

interface ProductCardMiniProps {
  product: Product
  showDiscount?: boolean
}

export default function ProductCardMini({ product, showDiscount = false }: ProductCardMiniProps) {
  const hasDiscount = showDiscount && product.discount && product.original_price

  return (
    <Link
      href={`/categorias/${product.category}/${product.slug}`}
      className="group flex-shrink-0 w-[200px] snap-start"
    >
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="200px"
            className="object-contain p-3 transition-transform duration-200 group-hover:scale-105"
          />
          {hasDiscount ? (
            <Badge className="absolute top-2 left-2 bg-[#E38E49] text-white border-0 text-xs font-bold">
              -{product.discount}%
            </Badge>
          ) : null}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating ? (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="text-xs text-gray-400">{product.rating}</span>
            </div>
          ) : null}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toLocaleString('es-MX')}
            </span>
            {hasDiscount ? (
              <span className="text-sm text-gray-400 line-through">
                ${product.original_price!.toLocaleString('es-MX')}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
