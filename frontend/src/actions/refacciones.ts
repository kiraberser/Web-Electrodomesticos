'use server'

import { TYPES, BRANDS, CATEGORIES } from "@/data/products"

export type ProductActionState = {
    success?: boolean
    id?: string
    message?: string
    redirectTo?: string
    fieldErrors?: Partial<
        Record<"name" | "slug" | "price" | "brand" | "type" | "category" | "shortDescription" | "image", string>
    >
}

function isIn<T extends string>(val: string, arr: readonly T[]): val is T {
    return (arr as readonly string[]).includes(val)
}

export async function createProduct(prev: ProductActionState, formData: FormData): Promise<ProductActionState> {
    const name = ((formData.get("name") as string) || "").trim()
    const slug = ((formData.get("slug") as string) || "").trim()
    const priceStr = ((formData.get("price") as string) || "").trim()
    const brand = ((formData.get("brand") as string) || "").trim()
    const type = ((formData.get("type") as string) || "").trim()
    const category = ((formData.get("category") as string) || "").trim()
    const image = ((formData.get("image") as string) || "").trim()
    const shortDescription = ((formData.get("shortDescription") as string) || "").trim()
    const inStockRaw = (formData.get("inStock") as string) || ""
    const specsRaw = ((formData.get("specs") as string) || "[]").trim()
    const intent = ((formData.get("intent") as string) || "save").trim()

    const fieldErrors: ProductActionState["fieldErrors"] = {}

    if (!name) fieldErrors.name = "El nombre es requerido"
    if (!slug) fieldErrors.slug = "El slug es requerido"

    // Validación de precio
    const price = Number.parseFloat(priceStr)
    if (Number.isNaN(price) || price <= 0) {
        fieldErrors.price = "El precio debe ser un número mayor a 0"
    }

    // Validación de marca, tipo y categoría
    if (!isIn(brand, BRANDS)) {
        fieldErrors.brand = "Marca inválida"
    }
    if (!isIn(type, TYPES)) {
        fieldErrors.type = "Tipo inválido"
    }
    const categoryKeys = CATEGORIES.map((c) => c.key)
    if (!categoryKeys.includes(category)) {
        fieldErrors.category = "Categoría inválida"
    }

    if (!shortDescription) {
        fieldErrors.shortDescription = "La descripción corta es requerida"
    }

    if (!image) {
        fieldErrors.image = "La URL de imagen es requerida"
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, message: "Revisa los campos marcados", fieldErrors }
    }

    // Parse specs
    let specs: Array<{ label: string; value: string }> = []
    try {
        const parsed = JSON.parse(specsRaw)
        if (Array.isArray(parsed)) {
            specs = parsed
                .map((s) => ({ label: String(s.label || "").trim(), value: String(s.value || "").trim() }))
                .filter((s) => s.label && s.value)
        }
    } catch {
        // Silencioso; dejamos specs vacío
    }

    const inStock = inStockRaw === "on" || inStockRaw === "true"

    // Simula guardado (reemplaza por tu persistencia real)
    await new Promise((r) => setTimeout(r, 700))

    // Genera un id "SKU" simulado
    const id = `${brand.slice(0, 3).toLowerCase()}-${slug}`

    const redirectTo =
        intent === "save_and_view" ? `/categorias/${encodeURIComponent(category)}/${encodeURIComponent(slug)}` : undefined

    // Aquí persistirías en tu DB:
    // await db.insertProduct({ id, slug, name, price, brand, type, category, image, shortDescription, specs, inStock })

    return {
        success: true,
        id,
        message: "Producto guardado correctamente",
        redirectTo,
    }
}
