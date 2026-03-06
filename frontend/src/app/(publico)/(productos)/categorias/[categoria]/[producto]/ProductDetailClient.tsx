"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import { type Refaccion, type ComentarioProducto } from "@/features/catalog/api"
import { type Brand, type Product, ProductType } from "@/shared/data/products"
import AuthRequiredModal from "@/features/favorites/AuthRequiredModal"
import ProductSpecs from "@/features/catalog/ProductSpecs"
import ProductComments from "@/features/catalog/ProductComments"
import ProductImagePanel from "@/features/catalog/ProductImagePanel"
import ProductBuyBox from "@/features/catalog/ProductBuyBox"
import { useFavoriteSync } from "@/features/catalog/hooks/useFavoriteSync"
import { useAuthModal } from "@/features/catalog/hooks/useAuthModal"

interface Props {
  categoria: string
  refaccion: Refaccion
  initialIsFavorite?: boolean
  initialComentarios?: ComentarioProducto[]
}

export default function ProductDetailClient({ categoria, refaccion, initialIsFavorite = false, initialComentarios = [] }: Props) {
  const router = useRouter()
  const { isMounted, showAuthModal, setShowAuthModal } = useAuthModal()
  const { isFavorite, isFavoriteLoading, toggleFavorite } = useFavoriteSync(
    refaccion.id,
    initialIsFavorite,
    () => setShowAuthModal(true),
  )

  // Build normalized product from refaccion data
  const product: Product = useMemo(
    () => ({
      id: String(refaccion.id),
      slug: refaccion.codigo_parte,
      name: refaccion.nombre,
      price: Number(refaccion.precio),
      brand: refaccion.marca as Brand,
      type: refaccion.categoria_nombre as ProductType,
      category: categoria,
      image: refaccion.imagen || "/placeholder.svg",
      shortDescription: refaccion.descripcion || "",
      specs: [
        { label: "Marca", value: refaccion.marca },
        { label: "Código", value: refaccion.codigo_parte },
        { label: "Estado", value: refaccion.estado },
        ...(refaccion.compatibilidad
          ? [{ label: "Compatibilidad", value: refaccion.compatibilidad }]
          : []),
      ],
      inStock: refaccion.existencias > 0,
    }),
    [refaccion, categoria],
  )

  return (
    <>
      <main className="min-h-screen bg-gray-50 font-sans">
        {/* Sticky breadcrumb nav */}
        <section className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-[#0A3981] hover:bg-[#D4EBF8]/20 pl-0"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Regresar al listado</span>
            </Button>
            <nav className="text-xs sm:text-sm text-gray-400 truncate max-w-[200px] sm:max-w-none">
              <Link href="/categorias" className="hover:text-[#1F509A] transition-colors">
                Categorías
              </Link>
              {" / "}
              <Link
                href={`/categorias/${categoria}`}
                className="hover:text-[#1F509A] transition-colors capitalize"
              >
                {categoria}
              </Link>
              {" / "}
              <span className="text-[#0A3981] font-medium">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Main product layout */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
            <ProductImagePanel
              image={product.image}
              name={product.name}
              inStock={product.inStock}
            />
            <ProductBuyBox
              product={product}
              refaccion={refaccion}
              isFavorite={isFavorite}
              isFavoriteLoading={isFavoriteLoading}
              toggleFavorite={toggleFavorite}
            />
          </div>

          {/* Specs + Comments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <ProductSpecs product={product} description={refaccion.descripcion} />
            {refaccion?.id && (
              <div className="lg:col-span-1">
                <ProductComments productId={refaccion.id} initialComentarios={initialComentarios} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Auth modal — only mounted after hydration to avoid SSR mismatch */}
      {isMounted && showAuthModal && (
        <AuthRequiredModal
          isOpen={showAuthModal}
          onCloseAction={() => setShowAuthModal(false)}
        />
      )}
    </>
  )
}
