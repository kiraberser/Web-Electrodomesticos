"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Textarea } from "@/components/ui/display/Textarea"
import { Checkbox } from "@/components/ui/forms/Checkbox"

import { BRANDS, CATEGORIES, TYPES } from "@/data/products"
import { createProduct, type ProductActionState } from '@/actions/refacciones'
import { Package, Save, Eye, ArrowLeft, Hash, ImageIcon, DollarSign, Tags, Plus, Trash2, Boxes } from "lucide-react"
import { useToast } from "@/hook/use-toast"

type Spec = { label: string; value: string }

function slugify(s: string) {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
}

const initialState: ProductActionState = { success: undefined, message: undefined }

export default function CrearProductoPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [price, setPrice] = useState<string>("")
    const [brand, setBrand] = useState<(typeof BRANDS)[number] | "">("")
    const [type, setType] = useState<(typeof TYPES)[number] | "">("")
    const [category, setCategory] = useState<string>("")
    const [image, setImage] = useState("")
    const [shortDescription, setShortDescription] = useState("")
    const [inStock, setInStock] = useState(true)
    const [specs, setSpecs] = useState<Spec[]>([{ label: "", value: "" }])

    const [state, formAction, pending] = useActionState<ProductActionState, FormData>(createProduct, initialState)

    useEffect(() => {
        if (state?.success) {
            toast({
                title: "Producto guardado",
                description: state.message || "Se ha guardado correctamente.",
            })
            if (state.redirectTo) {
                router.push(state.redirectTo)
            } else {
                // Reset "suave"
                // setName(""); setSlug(""); ... si lo deseas
            }
        } else if (state?.success === false && state.message) {
            toast({
                title: "No se pudo guardar",
                description: state.message,
                variant: "destructive",
            })
        }
    }, [state, router, toast])

    const excerptLen = useMemo(() => shortDescription.trim().length, [shortDescription])

    const addSpec = () => setSpecs((prev) => [...prev, { label: "", value: "" }])
    const removeSpec = (idx: number) => setSpecs((prev) => prev.filter((_, i) => i !== idx))
    const updateSpec = (idx: number, field: keyof Spec, value: string) =>
        setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)))

    const filteredSpecs = specs.filter((s) => s.label.trim() || s.value.trim())

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="hidden sm:block rounded-lg bg-blue-100 p-2">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Crear refaccion</h1>
                                <p className="text-gray-600">Agrega una nueva refacción al catálogo.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="cursor-pointer bg-transparent"
                                aria-label="Volver"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                            <Button
                                type="submit"
                                form="product-form"
                                name="intent"
                                value="save"
                                disabled={pending}
                                variant="outline"
                                className="cursor-pointer bg-transparent"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {pending ? "Guardando…" : "Guardar"}
                            </Button>
                            <Button
                                type="submit"
                                form="product-form"
                                name="intent"
                                value="save_and_view"
                                disabled={pending}
                                className="bg-blue-600 text-white cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                {pending ? "Guardando…" : "Guardar y ver"}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

¡
            <section className="container mx-auto gap-6 px-4 py-6">
                <form id="product-form" action={formAction} className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                            <Boxes className="mr-2 h-5 w-5 text-blue-600" />
                            Información básica
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
                                <Input
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej. Ventilador Industrial 24”"
                                    className={state?.fieldErrors?.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                />
                                {state?.fieldErrors?.name && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>}
                            </div>
                            <div>
                                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Hash className="h-4 w-4 text-blue-600" />
                                    Slug
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        name="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="ventilador-industrial-24"
                                        className={state?.fieldErrors?.slug ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSlug(slugify(name))}
                                        className="shrink-0 cursor-pointer bg-transparent"
                                    >
                                        Auto
                                    </Button>
                                </div>
                                {state?.fieldErrors?.slug && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.slug}</p>}
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Marca</label>
                                <select
                                    name="brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value as typeof brand)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${state?.fieldErrors?.brand ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                                        }`}
                                >
                                    <option value="">Selecciona</option>
                                    {BRANDS.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                                {state?.fieldErrors?.brand && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.brand}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
                                <select
                                    name="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as typeof type)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${state?.fieldErrors?.type ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                                        }`}
                                >
                                    <option value="">Selecciona</option>
                                    {TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                {state?.fieldErrors?.type && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.type}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
                                <select
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${state?.fieldErrors?.category ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                                        }`}
                                >
                                    <option value="">Selecciona</option>
                                    {CATEGORIES.map((c) => (
                                        <option key={c.key} value={c.key}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                                {state?.fieldErrors?.category && (
                                    <p className="mt-1 text-sm text-red-600">{state.fieldErrors.category}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Precio y stock */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                            <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                            Precio y stock
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Precio (MXN)</label>
                                <Input
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className={state?.fieldErrors?.price ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                />
                                {state?.fieldErrors?.price && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.price}</p>}
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                <Checkbox id="inStock" checked={inStock} onCheckedChange={(v) => setInStock(Boolean(v))} />
                                <label htmlFor="inStock" className="text-sm text-gray-800">
                                    Disponible en stock
                                </label>
                            </div>
                        </div>

                        <input type="hidden" name="inStock" value={String(inStock)} />
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                            <ImageIcon className="mr-2 h-5 w-5 text-blue-600" />
                            Medios y descripción
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Imagen (URL)</label>
                                <Input
                                    name="image"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="/placeholder.svg?height=640&width=640"
                                    className={state?.fieldErrors?.image ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                />
                                {state?.fieldErrors?.image && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.image}</p>}

                                <div className="mt-3 h-48 w-full overflow-hidden rounded-lg border bg-white">
                                    <img
                                        src={image || "/placeholder.svg?height=320&width=640&query=product-placeholder"}
                                        alt="Vista previa"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Tags className="h-4 w-4 text-blue-600" />
                                    Descripción corta
                                </label>
                                <Textarea
                                    name="shortDescription"
                                    rows={6}
                                    value={shortDescription}
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    placeholder="Resumen breve del producto..."
                                    className={
                                        state?.fieldErrors?.shortDescription ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }
                                />
                                <div className="mt-1 text-xs text-gray-500">{excerptLen} caracteres</div>
                                {state?.fieldErrors?.shortDescription && (
                                    <p className="mt-1 text-sm text-red-600">{state.fieldErrors.shortDescription}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Especificaciones</h2>

                        <div className="space-y-3">
                            {specs.map((s, idx) => (
                                <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                                    <Input
                                        placeholder="Etiqueta (p. ej. Velocidades)"
                                        value={s.label}
                                        onChange={(e) => updateSpec(idx, "label", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Valor (p. ej. 3)"
                                        value={s.value}
                                        onChange={(e) => updateSpec(idx, "value", e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => removeSpec(idx)}
                                        className="justify-center bg-transparent cursor-pointer"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Quitar
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <Button type="button" variant="outline" onClick={addSpec} className="bg-transparent cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar especificación
                            </Button>
                        </div>

                        <input type="hidden" name="specs" value={JSON.stringify(filteredSpecs)} />
                    </div>
                </form>

            </section>
        </main>
    )
}
