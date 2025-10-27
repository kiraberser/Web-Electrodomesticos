export type ProductType = "Pedestal" | "Techo" | "Industrial" | "Pared"
export type Brand = "Azteca" | "Oster" | "Recco" | "IndustrialPro" | "VegaTech"

export interface Product {
  id: string
  slug: string
  discount?: number | null
  name: string
  price: number
  brand: Brand
  type: ProductType
  category: string // e.g. "ventiladores" | "refacciones"
  image: string
  shortDescription: string
  specs: Array<{ label: string; value: string }>
  inStock: boolean
}

export const CATEGORIES: Array<{ key: string; label: string; description: string; cover: string }> = [
  {
    key: "ventiladores",
    label: "Ventiladores",
    description: "Enfriamiento eficiente para hogar, industria y comercios",
    cover:
      "/placeholder.svg?height=480&width=960",
  },
  {
    key: "refacciones",
    label: "Refacciones",
    description: "Refacciones originales para electrodomésticos y ventilación",
    cover:
      "/placeholder.svg?height=480&width=960",
  },
]

export const BRANDS: Brand[] = ["Azteca", "Oster", "Recco", "IndustrialPro", "VegaTech"]
export const TYPES: ProductType[] = ["Pedestal", "Techo", "Industrial", "Pared"]

export const products: Product[] = [
  {
    id: "v-azt-3v-001",
    slug: "ventilador-azteca-3-velocidades",
    name: "Ventilador Azteca 3 Velocidades 18”",
    price: 1299,
    brand: "Azteca",
    type: "Pedestal",
    category: "ventiladores",
    image:
      "/placeholder.svg?height=640&width=640",
    shortDescription: "Flujo de aire potente con 3 velocidades, ideal para hogar u oficina.",
    specs: [
      { label: "Velocidades", value: "3" },
      { label: "Diámetro", value: "18 pulgadas" },
      { label: "Consumo", value: "60W" },
    ],
    inStock: true,
  },
  {
    id: "v-ost-tt-002",
    slug: "ventilador-de-techo-oster-56",
    name: "Ventilador de Techo Oster 56”",
    price: 1599,
    brand: "Oster",
    type: "Techo",
    category: "ventiladores",
    image:
      "/placeholder.svg?height=640&width=640",
    shortDescription: "Diseño silencioso con alto desempeño y acabado premium.",
    specs: [
      { label: "Velocidades", value: "5" },
      { label: "Aspas", value: "Aluminio" },
      { label: "Garantía", value: "2 años" },
    ],
    inStock: true,
  },
  {
    id: "v-ind-pro-003",
    slug: "ventilador-industrial-24",
    name: "Ventilador IndustrialPro 24”",
    price: 2799,
    brand: "IndustrialPro",
    type: "Industrial",
    category: "ventiladores",
    image:
      "/placeholder.svg?height=640&width=640",
    shortDescription: "Para naves y talleres. Motor de alto torque y rejilla reforzada.",
    specs: [
      { label: "Flujo de aire", value: "Alta potencia" },
      { label: "Material", value: "Acero" },
      { label: "Certificación", value: "IPX2" },
    ],
    inStock: true,
  },
  {
    id: "v-rec-wall-004",
    slug: "ventilador-de-pared-recco-16",
    name: "Ventilador de Pared Recco 16”",
    price: 999,
    brand: "Recco",
    type: "Pared",
    category: "ventiladores",
    image:
      "/placeholder.svg?height=640&width=640",
    shortDescription: "Ahorra espacio con control frontal y oscilación amplia.",
    specs: [
      { label: "Velocidades", value: "3" },
      { label: "Montaje", value: "Pared" },
      { label: "Control", value: "Frontal" },
    ],
    inStock: true,
  },
  {
    id: "r-asp-azt-005",
    slug: "aspa-para-ventilador-18",
    name: "Aspa Para Ventilador 18” Azteca",
    price: 249,
    brand: "Azteca",
    type: "Pedestal",
    category: "refacciones",
    image:
      "/placeholder.svg?height=640&width=640",
    shortDescription: "Aspa de repuesto balanceada para 18 pulgadas.",
    specs: [
      { label: "Diámetro", value: "18”" },
      { label: "Material", value: "ABS" },
      { label: "Compatibilidad", value: "Multimarca" },
    ],
    inStock: true,
  },
  {
    id: "r-mot-veg-006",
    slug: "motor-para-ventilador-universal",
    name: "Motor Universal VegaTech 60W",
    price: 699,
    brand: "VegaTech",
    type: "Pedestal",
    category: "refacciones",
    image:
      "/placeholder.svg?height=640&width=640",
    shortDescription: "Motor de reemplazo para ventiladores pedestal y pared.",
    specs: [
      { label: "Potencia", value: "60W" },
      { label: "Voltaje", value: "110V" },
      { label: "RPM", value: "1200" },
    ],
    inStock: true,
  },
]
