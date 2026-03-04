"use client"

import { memo } from "react"
import Image from "next/image"

interface Props {
  image: string
  name: string
  inStock: boolean
}

// memo() — only re-renders when image/name/inStock actually change (Vercel: rerender-memo)
const ProductImagePanel = memo(function ProductImagePanel({ image, name, inStock }: Props) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className="relative aspect-square w-full bg-white rounded-xl overflow-hidden border border-gray-100 group">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          priority
        />
        {!inStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
            Agotado
          </div>
        )}
      </div>
    </div>
  )
})

export default ProductImagePanel
