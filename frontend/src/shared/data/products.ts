export type ProductType = "Pedestal" | "Techo" | "Industrial" | "Pared"
export type Brand = "Azteca" | "Oster" | "Recco" | "IndustrialPro" | "VegaTech" | "Mabe" | "Koblenz" | "Mirage" | "Siemens"
export type ProductTag = "oferta" | "mas_vendido" | "nuevo"

export interface Product {
  id: string
  slug: string
  discount?: number | null
  name: string
  price: number
  brand: Brand
  type: ProductType
  category: string
  image: string
  shortDescription: string
  specs: Array<{ label: string; value: string }>
  inStock: boolean
  rating?: number
  original_price?: number
  tag?: ProductTag
}

export const CATEGORIES: Array<{ key: string; label: string; description: string; cover: string }> = [
  {
    key: "ventiladores",
    label: "Ventiladores",
    description: "Enfriamiento eficiente para hogar, industria y comercios",
    cover: "/placeholder.svg?height=480&width=960",
  },
  {
    key: "refacciones",
    label: "Refacciones",
    description: "Refacciones originales para electrodomésticos y ventilación",
    cover: "/placeholder.svg?height=480&width=960",
  },
]

export const BRANDS: Brand[] = ["Azteca", "Oster", "Recco", "IndustrialPro", "VegaTech"]
export const TYPES: ProductType[] = ["Pedestal", "Techo", "Industrial", "Pared"]

export const products: Product[] = [
  // === OFERTAS (4 productos con descuento) ===
  {
    id: "v-azt-3v-001",
    slug: "ventilador-azteca-3-velocidades",
    name: "Ventilador Azteca 3 Velocidades 18\"",
    price: 999,
    original_price: 1299,
    discount: 23,
    brand: "Azteca",
    type: "Pedestal",
    category: "ventiladores",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Flujo de aire potente con 3 velocidades, ideal para hogar u oficina.",
    specs: [
      { label: "Velocidades", value: "3" },
      { label: "Diámetro", value: "18 pulgadas" },
      { label: "Consumo", value: "60W" },
    ],
    inStock: true,
    rating: 4.5,
    tag: "oferta",
  },
  {
    id: "r-mot-veg-006",
    slug: "motor-para-ventilador-universal",
    name: "Motor Universal VegaTech 60W",
    price: 549,
    original_price: 699,
    discount: 21,
    brand: "VegaTech",
    type: "Pedestal",
    category: "refacciones",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Motor de reemplazo para ventiladores pedestal y pared.",
    specs: [
      { label: "Potencia", value: "60W" },
      { label: "Voltaje", value: "110V" },
      { label: "RPM", value: "1200" },
    ],
    inStock: true,
    rating: 4.7,
    tag: "oferta",
  },
  {
    id: "lav-mabe-01",
    slug: "lavadora-mabe-16kg",
    name: "Lavadora Mabe Aqua Saver 16kg",
    price: 7499,
    original_price: 8999,
    discount: 17,
    brand: "Mabe",
    type: "Pedestal",
    category: "lavadoras",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Lavadora automática con sistema Aqua Saver para ahorro de agua.",
    specs: [
      { label: "Capacidad", value: "16 kg" },
      { label: "Ciclos", value: "10" },
      { label: "Consumo", value: "Clase A" },
    ],
    inStock: true,
    rating: 4.6,
    tag: "oferta",
  },
  {
    id: "ms-mirage-01",
    slug: "minisplit-mirage-1ton",
    name: "Minisplit Mirage Absolut X 1 Ton",
    price: 8999,
    original_price: 10499,
    discount: 14,
    brand: "Mirage",
    type: "Pared",
    category: "minisplit",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Aire acondicionado inverter con WiFi y filtro antibacterial.",
    specs: [
      { label: "Capacidad", value: "1 Tonelada" },
      { label: "SEER", value: "17" },
      { label: "Refrigerante", value: "R-410A" },
    ],
    inStock: true,
    rating: 4.8,
    tag: "oferta",
  },

  // === MÁS VENDIDOS (4 productos populares) ===
  {
    id: "v-ost-tt-002",
    slug: "ventilador-de-techo-oster-56",
    name: "Ventilador de Techo Oster 56\"",
    price: 1599,
    brand: "Oster",
    type: "Techo",
    category: "ventiladores",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Diseño silencioso con alto desempeño y acabado premium.",
    specs: [
      { label: "Velocidades", value: "5" },
      { label: "Aspas", value: "Aluminio" },
      { label: "Garantía", value: "2 años" },
    ],
    inStock: true,
    rating: 4.9,
    tag: "mas_vendido",
  },
  {
    id: "r-asp-azt-005",
    slug: "aspa-para-ventilador-18",
    name: "Aspa Para Ventilador 18\" Azteca",
    price: 249,
    brand: "Azteca",
    type: "Pedestal",
    category: "refacciones",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Aspa de repuesto balanceada para 18 pulgadas.",
    specs: [
      { label: "Diámetro", value: "18\"" },
      { label: "Material", value: "ABS" },
      { label: "Compatibilidad", value: "Multimarca" },
    ],
    inStock: true,
    rating: 4.4,
    tag: "mas_vendido",
  },
  {
    id: "kob-lic-01",
    slug: "licuadora-koblenz-10vel",
    name: "Licuadora Koblenz LKM-4510 10 Vel",
    price: 899,
    brand: "Koblenz",
    type: "Pedestal",
    category: "licuadoras",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Licuadora de 10 velocidades con vaso de vidrio de 1.5L y cuchillas de acero.",
    specs: [
      { label: "Velocidades", value: "10" },
      { label: "Vaso", value: "1.5L vidrio" },
      { label: "Potencia", value: "450W" },
    ],
    inStock: true,
    rating: 4.6,
    tag: "mas_vendido",
  },
  {
    id: "kob-bomb-01",
    slug: "bomba-de-agua-koblenz-1hp",
    name: "Bomba de Agua Koblenz 1 HP",
    price: 2199,
    brand: "Koblenz",
    type: "Pedestal",
    category: "bombas-de-agua",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Bomba periférica de 1 HP para uso doméstico e industrial ligero.",
    specs: [
      { label: "Potencia", value: "1 HP" },
      { label: "Flujo máx", value: "40 L/min" },
      { label: "Voltaje", value: "127V" },
    ],
    inStock: true,
    rating: 4.5,
    tag: "mas_vendido",
  },

  // === RECIÉN LLEGADOS (4 productos nuevos) ===
  {
    id: "v-ind-pro-003",
    slug: "ventilador-industrial-24",
    name: "Ventilador IndustrialPro 24\"",
    price: 2799,
    brand: "IndustrialPro",
    type: "Industrial",
    category: "ventiladores",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Para naves y talleres. Motor de alto torque y rejilla reforzada.",
    specs: [
      { label: "Flujo de aire", value: "Alta potencia" },
      { label: "Material", value: "Acero" },
      { label: "Certificación", value: "IPX2" },
    ],
    inStock: true,
    rating: 4.3,
    tag: "nuevo",
  },
  {
    id: "v-rec-wall-004",
    slug: "ventilador-de-pared-recco-16",
    name: "Ventilador de Pared Recco 16\"",
    price: 999,
    brand: "Recco",
    type: "Pared",
    category: "ventiladores",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Ahorra espacio con control frontal y oscilación amplia.",
    specs: [
      { label: "Velocidades", value: "3" },
      { label: "Montaje", value: "Pared" },
      { label: "Control", value: "Frontal" },
    ],
    inStock: true,
    rating: 4.2,
    tag: "nuevo",
  },
  {
    id: "sie-micro-01",
    slug: "microondas-siemens-23l",
    name: "Microondas Siemens iQ300 23L",
    price: 3499,
    brand: "Siemens",
    type: "Pedestal",
    category: "microondas",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Microondas con grill integrado, 23 litros y panel digital.",
    specs: [
      { label: "Capacidad", value: "23L" },
      { label: "Potencia", value: "900W" },
      { label: "Grill", value: "1200W" },
    ],
    inStock: true,
    rating: 4.7,
    tag: "nuevo",
  },
  {
    id: "mabe-ref-01",
    slug: "refrigerador-mabe-10pies",
    name: "Refrigerador Mabe 10 Pies Grafito",
    price: 6999,
    brand: "Mabe",
    type: "Pedestal",
    category: "refrigeradores",
    image: "/placeholder.svg?height=640&width=640",
    shortDescription: "Refrigerador compacto con congelador superior y acabado grafito.",
    specs: [
      { label: "Capacidad", value: "10 pies³" },
      { label: "Tipo", value: "Top Mount" },
      { label: "Eficiencia", value: "Inverter" },
    ],
    inStock: true,
    rating: 4.8,
    tag: "nuevo",
  },
]

// Helper functions for categorized product rows
export const getDealProducts = (): Product[] =>
  products.filter((p) => p.tag === "oferta")

export const getBestSellers = (): Product[] =>
  products.filter((p) => p.tag === "mas_vendido")

export const getNewArrivals = (): Product[] =>
  products.filter((p) => p.tag === "nuevo")
