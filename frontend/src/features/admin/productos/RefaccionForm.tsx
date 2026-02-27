"use client"

import { useEffect, useActionState, useState, ReactNode } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/features/admin/ui/Button"
import { Input } from "@/features/admin/ui/Input"
import { Select } from "@/features/admin/ui/Select"
import { ImageUpload } from "@/features/admin/ui/ImageUpload"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import {
    createRefaccionAction,
    updateRefaccionAction,
} from "@/features/catalog/admin-actions"
import type { Refaccion, Categoria, Proveedor, RefaccionSpec } from "@/features/catalog/api"
import {
    X, Plus, Trash2, Lock, Unlock, Globe, ChevronDown, ChevronUp,
    Package, DollarSign, FileText, Wrench, Tag,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

const SITE_DOMAIN = 'refaccionariavega.com.mx'

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 200) || ''
}

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            variant="primary"
            disabled={pending}
            className="flex-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isEditing ? "Actualizando..." : "Creando..."}
                </>
            ) : (
                <>
                    <Plus className="mr-2 h-4 w-4" />
                    {isEditing ? "Actualizar" : "Crear"} Refacción
                </>
            )}
        </Button>
    )
}

function CharCounter({ value, max }: { value: string; max: number }) {
    const len = value.length
    const pct = len / max
    const color = pct >= 1 ? 'text-red-500' : pct >= 0.85 ? 'text-amber-500' : 'text-slate-400'
    return <span className={`text-xs tabular-nums ${color}`}>{len}/{max}</span>
}

function GooglePreview({
    title, slug, description, dark,
}: { title: string; slug: string; description: string; dark: boolean }) {
    const displayTitle = title || 'Título del producto'
    const displayDesc = description || 'Descripción que aparecerá en Google. Rellena la Meta Descripción para controlar este texto.'
    const displayUrl = `${SITE_DOMAIN} › categorias › ${slug || 'nombre-producto'}`
    return (
        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-700 bg-slate-950/60' : 'border-gray-200 bg-white'}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                Vista previa en Google
            </p>
            <div className="space-y-0.5 max-w-xl">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex-shrink-0" />
                    <span className={`text-xs truncate ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{displayUrl}</span>
                </div>
                <p className={`text-base font-medium leading-tight line-clamp-1 ${dark ? 'text-blue-400' : 'text-blue-700'} hover:underline cursor-pointer`}>
                    {displayTitle.slice(0, 60)}
                </p>
                <p className={`text-sm leading-snug line-clamp-2 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {displayDesc.slice(0, 155)}
                </p>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────
// Section wrapper helper (inline, not a React component)
// ─────────────────────────────────────────────────────────────────

function SectionHeader({
    icon, label, badge, dark,
}: { icon: ReactNode; label: string; badge?: string; dark: boolean }) {
    return (
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${dark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{label}</span>
            {badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${dark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                    {badge}
                </span>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────
// Main Form
// ─────────────────────────────────────────────────────────────────

interface RefaccionFormProps {
    refaccion?: Refaccion | null
    onSuccess: () => void
    onCancel: () => void
    categorias?: Categoria[]
    proveedores?: Proveedor[]
}

const ESTADO_OPTIONS = [
    { value: 'NVO', label: 'Nuevo' },
    { value: 'UBS', label: 'Usado - Buen Estado' },
    { value: 'REC', label: 'Reacondicionado' },
]

export default function RefaccionForm({
    refaccion,
    onSuccess,
    onCancel,
    categorias = [],
    proveedores = [],
}: RefaccionFormProps) {
    const initialState = { success: false, error: null }
    const { dark } = useAdminTheme()
    const action = refaccion?.id ? updateRefaccionAction : createRefaccionAction
    const [state, formAction] = useActionState(action, initialState)

    // ── Interactive state ──────────────────────────────────────────
    const [localNombre, setLocalNombre] = useState(refaccion?.nombre ?? "")
    const [slugAuto, setSlugAuto] = useState(!refaccion?.slug)
    const [localSlug, setLocalSlug] = useState(refaccion?.slug ?? "")
    const [localMetaTitle, setLocalMetaTitle] = useState(refaccion?.titulo_seo ?? "")
    const [localMetaDesc, setLocalMetaDesc] = useState(refaccion?.descripcion_seo ?? "")
    const [specs, setSpecs] = useState<RefaccionSpec[]>(
        Array.isArray(refaccion?.specs) ? (refaccion.specs as RefaccionSpec[]) : []
    )
    const [specsOpen, setSpecsOpen] = useState(false)
    const [seoOpen, setSeoOpen] = useState(false)

    // Re-sync when editing a different refaccion
    useEffect(() => {
        setLocalNombre(refaccion?.nombre ?? "")
        setSlugAuto(!refaccion?.slug)
        setLocalSlug(refaccion?.slug ?? "")
        setLocalMetaTitle(refaccion?.titulo_seo ?? "")
        setLocalMetaDesc(refaccion?.descripcion_seo ?? "")
        setSpecs(Array.isArray(refaccion?.specs) ? (refaccion.specs as RefaccionSpec[]) : [])
        setSpecsOpen(false)
        setSeoOpen(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refaccion?.id])

    // Auto-generate slug from nombre
    useEffect(() => {
        if (slugAuto) setLocalSlug(slugify(localNombre))
    }, [localNombre, slugAuto])

    // Trigger success callback
    useEffect(() => {
        if (state.success) onSuccess()
    }, [state.success, onSuccess])

    // ── Specs helpers ──────────────────────────────────────────────
    const addSpec = () => setSpecs(prev => [...prev, { clave: '', valor: '' }])
    const removeSpec = (i: number) => setSpecs(prev => prev.filter((_, idx) => idx !== i))
    const updateSpec = (i: number, field: keyof RefaccionSpec, val: string) =>
        setSpecs(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))

    // ── Shared style helpers ───────────────────────────────────────
    const fe = state.error && typeof state.error === 'object'
        ? state.error as Record<string, { _errors: string[] }>
        : null

    const fieldClass = `flex w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition ${
        dark
            ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
    }`

    const sectionClass = `rounded-xl border ${
        dark ? 'border-slate-700/60 bg-slate-800/30' : 'border-gray-200 bg-gray-50/40'
    }`

    const dividerClass = `border-t border-dashed ${dark ? 'border-slate-700' : 'border-gray-200'}`

    return (
        <form action={formAction} className="space-y-4">
            {refaccion?.id && <input type="hidden" name="id" value={refaccion.id} />}
            {/* Serialized specs go as hidden input */}
            <input
                type="hidden"
                name="specs"
                value={JSON.stringify(specs.filter(s => s.clave.trim() || s.valor.trim()))}
            />

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {refaccion ? "Editar Refacción" : "Nueva Refacción"}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className={`rounded-md p-1 transition ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {state.error && typeof state.error === 'string' && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                    {state.error}
                </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 1. INFORMACIÓN BÁSICA                       */}
            {/* ═══════════════════════════════════════════ */}
            <div className={sectionClass}>
                <SectionHeader
                    icon={<Package className="h-3.5 w-3.5 text-blue-500" />}
                    label="Información básica"
                    dark={dark}
                />
                <div className={`px-4 pb-4 space-y-3 ${dividerClass} pt-3`}>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Input
                                label="Código de parte *"
                                name="codigo_parte"
                                placeholder="Ej: WP12345"
                                defaultValue={refaccion?.codigo_parte || ""}
                                required
                            />
                            {fe?.codigo_parte?._errors?.[0] && (
                                <p className="text-red-500 text-xs mt-1">{fe.codigo_parte._errors[0]}</p>
                            )}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                Nombre *
                            </label>
                            <input
                                name="nombre"
                                placeholder="Ej: Compresor de refrigerador"
                                value={localNombre}
                                onChange={e => setLocalNombre(e.target.value)}
                                required
                                className={fieldClass}
                            />
                            {fe?.nombre?._errors?.[0] && (
                                <p className="text-red-500 text-xs mt-1">{fe.nombre._errors[0]}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Input
                                label="Marca *"
                                name="marca"
                                placeholder="Ej: Samsung, LG, Whirlpool"
                                defaultValue={refaccion?.marca || ""}
                                required
                            />
                            {fe?.marca?._errors?.[0] && (
                                <p className="text-red-500 text-xs mt-1">{fe.marca._errors[0]}</p>
                            )}
                        </div>
                        <div>
                            <Select
                                label="Categoría *"
                                name="categoria"
                                defaultValue={refaccion?.categoria}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </Select>
                            {fe?.categoria?._errors?.[0] && (
                                <p className="text-red-500 text-xs mt-1">{fe.categoria._errors[0]}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Select
                            label="Proveedor (Opcional)"
                            name="proveedor"
                            defaultValue={refaccion?.proveedor || ""}
                        >
                            <option value="">Sin proveedor asignado</option>
                            {proveedores.map((prov) => (
                                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* 2. DESCRIPCIONES                            */}
            {/* ═══════════════════════════════════════════ */}
            <div className={sectionClass}>
                <SectionHeader
                    icon={<FileText className="h-3.5 w-3.5 text-violet-500" />}
                    label="Descripciones"
                    dark={dark}
                />
                <div className={`px-4 pb-4 space-y-3 ${dividerClass} pt-3`}>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                            Descripción corta{' '}
                            <span className={`font-normal text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                para cards y listados, máx. 300 car.
                            </span>
                        </label>
                        <input
                            name="descripcion_corta"
                            placeholder="Una línea que aparece en el catálogo y cards de producto"
                            defaultValue={refaccion?.descripcion_corta || ""}
                            maxLength={300}
                            className={fieldClass}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                            Descripción completa
                        </label>
                        <textarea
                            name="descripcion"
                            placeholder="Descripción detallada de la refacción, materiales, funciones..."
                            defaultValue={refaccion?.descripcion || ""}
                            rows={3}
                            className={`${fieldClass} min-h-[72px]`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                            Compatibilidad *
                        </label>
                        <textarea
                            name="compatibilidad"
                            placeholder="Modelos de electrodomésticos compatibles"
                            rows={2}
                            defaultValue={refaccion?.compatibilidad || ""}
                            required
                            className={`${fieldClass} min-h-[56px]`}
                        />
                        {fe?.compatibilidad?._errors?.[0] && (
                            <p className="text-red-500 text-xs mt-1">{fe.compatibilidad._errors[0]}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* 3. IMAGEN                                   */}
            {/* ═══════════════════════════════════════════ */}
            <div className={sectionClass}>
                <SectionHeader
                    icon={<Tag className="h-3.5 w-3.5 text-emerald-500" />}
                    label="Imagen"
                    dark={dark}
                />
                <div className={`px-4 pb-4 ${dividerClass} pt-3`}>
                    <ImageUpload
                        label="Imagen principal"
                        name="imagen"
                        currentImage={refaccion?.imagen}
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* 4. PRECIO Y STOCK                           */}
            {/* ═══════════════════════════════════════════ */}
            <div className={sectionClass}>
                <SectionHeader
                    icon={<DollarSign className="h-3.5 w-3.5 text-amber-500" />}
                    label="Precio y Stock"
                    dark={dark}
                />
                <div className={`px-4 pb-4 space-y-3 ${dividerClass} pt-3`}>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                            <Input
                                label="Precio actual *"
                                type="number"
                                name="precio"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                defaultValue={refaccion?.precio || ""}
                                required
                            />
                            {fe?.precio?._errors?.[0] && (
                                <p className="text-red-500 text-xs mt-1">{fe.precio._errors[0]}</p>
                            )}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                Precio original{' '}
                                <span className={`font-normal text-xs line-through ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    tachado
                                </span>
                            </label>
                            <input
                                type="number"
                                name="precio_tachado"
                                step="0.01"
                                min="0"
                                placeholder="Opcional"
                                defaultValue={refaccion?.precio_tachado != null ? String(refaccion.precio_tachado) : ""}
                                className={fieldClass}
                            />
                        </div>
                        <div>
                            <Input
                                label="Existencias *"
                                type="number"
                                name="existencias"
                                min="0"
                                placeholder="0"
                                defaultValue={refaccion?.existencias || ""}
                                required
                            />
                            {fe?.existencias?._errors?.[0] && (
                                <p className="text-red-500 text-xs mt-1">{fe.existencias._errors[0]}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Select
                            label="Estado *"
                            name="estado"
                            defaultValue={refaccion?.estado || 'NVO'}
                            required
                        >
                            {ESTADO_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                        {fe?.estado?._errors?.[0] && (
                            <p className="text-red-500 text-xs mt-1">{fe.estado._errors[0]}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* 5. ESPECIFICACIONES TÉCNICAS (collapsible)  */}
            {/* ═══════════════════════════════════════════ */}
            <div className={sectionClass}>
                <button
                    type="button"
                    onClick={() => setSpecsOpen(o => !o)}
                    className="w-full text-left"
                >
                    <div className="flex items-center gap-2.5 px-4 pt-4 pb-4">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${dark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                            <Wrench className="h-3.5 w-3.5 text-orange-500" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Especificaciones técnicas
                        </span>
                        {specs.length > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${dark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                                {specs.length} {specs.length === 1 ? 'spec' : 'specs'}
                            </span>
                        )}
                        <span className="ml-auto">
                            {specsOpen
                                ? <ChevronUp className="h-4 w-4 text-slate-400" />
                                : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </span>
                    </div>
                </button>

                {specsOpen && (
                    <div className={`px-4 pb-4 space-y-2 ${dividerClass} pt-3`}>
                        {specs.length === 0 && (
                            <p className={`text-xs text-center py-3 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                Sin especificaciones. Aparecerán como tabla en la ficha del producto.
                            </p>
                        )}
                        {specs.length > 0 && (
                            <div className={`grid text-xs font-medium mb-1 px-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}
                                style={{ gridTemplateColumns: '1fr 1fr auto' }}>
                                <span>Propiedad</span>
                                <span>Valor</span>
                                <span />
                            </div>
                        )}
                        {specs.map((spec, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Ej: Material"
                                    value={spec.clave}
                                    onChange={e => updateSpec(i, 'clave', e.target.value)}
                                    className={`${fieldClass} flex-1`}
                                />
                                <input
                                    type="text"
                                    placeholder="Ej: Acero inoxidable"
                                    value={spec.valor}
                                    onChange={e => updateSpec(i, 'valor', e.target.value)}
                                    className={`${fieldClass} flex-1`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpec(i)}
                                    className={`flex-shrink-0 p-1.5 rounded-md transition ${
                                        dark
                                            ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                    }`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSpec}
                            className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md transition ${
                                dark ? 'text-blue-400 hover:bg-blue-500/10' : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Agregar especificación
                        </button>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* 6. SEO (collapsible)                        */}
            {/* ═══════════════════════════════════════════ */}
            <div className={sectionClass}>
                <button
                    type="button"
                    onClick={() => setSeoOpen(o => !o)}
                    className="w-full text-left"
                >
                    <div className="flex items-center gap-2.5 px-4 pt-4 pb-4">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${dark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                            <Globe className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            SEO
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${dark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                            Opcional
                        </span>
                        {(localSlug || localMetaTitle || localMetaDesc) && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                Configurado
                            </span>
                        )}
                        <span className="ml-auto">
                            {seoOpen
                                ? <ChevronUp className="h-4 w-4 text-slate-400" />
                                : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </span>
                    </div>
                </button>

                {seoOpen && (
                    <div className={`px-4 pb-4 space-y-4 ${dividerClass} pt-3`}>

                        {/* Slug */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                Slug / URL
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none select-none ${dark ? 'text-slate-600' : 'text-gray-400'}`}>
                                        /ref/
                                    </span>
                                    <input
                                        name="slug"
                                        value={localSlug}
                                        onChange={e => {
                                            setSlugAuto(false)
                                            setLocalSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                                        }}
                                        placeholder="nombre-producto-slug"
                                        className={`${fieldClass} pl-10`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    title={slugAuto
                                        ? "Auto-generando desde el nombre (click para bloquear)"
                                        : "Slug manual (click para auto-generar)"}
                                    onClick={() => setSlugAuto(v => !v)}
                                    className={`flex-shrink-0 px-3 rounded-md border transition text-xs flex items-center gap-1.5 font-medium ${
                                        slugAuto
                                            ? dark
                                                ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                                                : 'border-blue-300 bg-blue-50 text-blue-600'
                                            : dark
                                                ? 'border-slate-700 bg-slate-800 text-slate-400'
                                                : 'border-gray-300 bg-white text-gray-500'
                                    }`}
                                >
                                    {slugAuto
                                        ? <><Unlock className="h-3 w-3" /> Auto</>
                                        : <><Lock className="h-3 w-3" /> Manual</>}
                                </button>
                            </div>
                            <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                {slugAuto
                                    ? "Generándose automáticamente desde el nombre del producto"
                                    : "Solo letras minúsculas, números y guiones ( - )"}
                            </p>
                        </div>

                        {/* Meta Title */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Título SEO{' '}
                                    <span className={`font-normal text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        (&lt;title&gt;)
                                    </span>
                                </label>
                                <CharCounter value={localMetaTitle} max={60} />
                            </div>
                            <input
                                name="titulo_seo"
                                placeholder={localNombre || "Ej: Compresor Samsung RF265 — Refaccionaria Vega"}
                                value={localMetaTitle}
                                onChange={e => setLocalMetaTitle(e.target.value.slice(0, 60))}
                                maxLength={60}
                                className={fieldClass}
                            />
                            <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                Si se omite se usa el nombre. Máx. 60 caracteres para evitar truncamiento en Google.
                            </p>
                        </div>

                        {/* Meta Description */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Meta Descripción{' '}
                                    <span className={`font-normal text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        (description)
                                    </span>
                                </label>
                                <CharCounter value={localMetaDesc} max={155} />
                            </div>
                            <textarea
                                name="descripcion_seo"
                                placeholder="Descripción optimizada para resultados de Google. Incluye el nombre de la pieza, marca y compatibilidad..."
                                value={localMetaDesc}
                                onChange={e => setLocalMetaDesc(e.target.value.slice(0, 155))}
                                rows={3}
                                maxLength={155}
                                className={`${fieldClass} min-h-[72px]`}
                            />
                        </div>

                        {/* Google SERP Preview */}
                        <GooglePreview
                            title={localMetaTitle || localNombre}
                            slug={localSlug}
                            description={localMetaDesc || refaccion?.descripcion_corta || refaccion?.descripcion || ""}
                            dark={dark}
                        />
                    </div>
                )}
            </div>

            {/* ── Actions ── */}
            <div className="flex gap-2 pt-2">
                <SubmitButton isEditing={!!refaccion?.id} />
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="cursor-pointer"
                >
                    Cancelar
                </Button>
            </div>
        </form>
    )
}
