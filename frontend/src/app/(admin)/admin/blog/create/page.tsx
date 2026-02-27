"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useActionState } from "react"
import dynamic from "next/dynamic"

import { Button } from "@/shared/ui/forms/Button"
import { Input } from "@/shared/ui/forms/InputField"
import { Badge } from "@/shared/ui/feedback/Badge"
import { Textarea } from "@/shared/ui/display/Textarea"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import { createPost, type BlogActionState } from "@/features/blog/actions"
import { categories } from "@/shared/data/category"
import {
  FileText,
  Hash,
  Tags,
  ImageIcon,
  Save,
  Eye,
  ArrowLeft,
  Search,
  Globe,
} from "lucide-react"

const RichEditor = dynamic(() => import("@/features/blog/ckeditor"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />,
})

// ─── Types ───────────────────────────────────────────────────────────────────

type BlogDraft = {
  title: string
  slug: string
  tags: string[]
  excerpt: string
  content: string
  meta_title: string
  meta_description: string
  focus_keyword: string
  robots: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function calcSeoScore(d: BlogDraft): number {
  let score = 0
  const kw = d.focus_keyword.toLowerCase()
  if (kw) score += 20
  if (kw && d.title.toLowerCase().includes(kw)) score += 25
  if (d.meta_description.length >= 50) score += 25
  if (kw && d.meta_description.toLowerCase().includes(kw)) score += 20
  if (d.tags.length > 0) score += 10
  return score
}

const initialState: BlogActionState = {}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CrearBlogPage() {
  const router = useRouter()
  const { dark } = useAdminTheme()

  const [draft, setDraft] = useState<BlogDraft>({
    title: "",
    slug: "",
    tags: [],
    excerpt: "",
    content: "",
    meta_title: "",
    meta_description: "",
    focus_keyword: "",
    robots: "index, follow",
  })
  const [slugTouched, setSlugTouched] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [preview, setPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const previewUrlRef = useRef<string | null>(null)

  const [state, formAction, pending] = useActionState<BlogActionState, FormData>(
    createPost,
    initialState,
  )

  // Revoke object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const next = selected ? URL.createObjectURL(selected) : null
    previewUrlRef.current = next
    setPreviewUrl(next)
  }, [])

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setDraft((d) => ({
        ...d,
        title: value,
        slug: slugTouched ? d.slug : slugify(value),
      }))
    },
    [slugTouched],
  )

  const handleAddTag = useCallback(() => {
    const t = tagInput.trim()
    if (!t || draft.tags.includes(t)) return
    setDraft((d) => ({ ...d, tags: [...d.tags, t] }))
    setTagInput("")
  }, [tagInput, draft.tags])

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleAddTag()
      }
    },
    [handleAddTag],
  )

  const handleRemoveTag = useCallback((t: string) => {
    setDraft((d) => ({ ...d, tags: d.tags.filter((x) => x !== t) }))
  }, [])

  // ── SEO ────────────────────────────────────────────────────────────────────

  const seoScore = calcSeoScore(draft)
  const seoColor =
    seoScore >= 70 ? "text-green-500" : seoScore >= 40 ? "text-amber-500" : "text-red-500"
  const seoBarColor =
    seoScore >= 70 ? "bg-green-500" : seoScore >= 40 ? "bg-amber-500" : "bg-red-500"
  const seoLabel = seoScore >= 70 ? "Bueno" : seoScore >= 40 ? "Mejorable" : "Pobre"

  const serpTitle = draft.meta_title || draft.title || "Título del artículo"
  const serpDesc =
    draft.meta_description ||
    draft.excerpt ||
    "Vista previa de la descripción en los resultados de búsqueda de Google..."
  const serpUrl = draft.slug ? `/blog/${draft.slug}` : "/blog/slug-del-articulo"

  // ── Class shorthands ───────────────────────────────────────────────────────

  const card = `rounded-xl border p-4 ${dark ? "border-white/10 bg-[#0F172A]" : "border-gray-200 bg-white"}`
  const lbl = `mb-1 block text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`
  const hint = `text-xs ${dark ? "text-gray-500" : "text-gray-400"}`
  const selectCls = `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "border-white/10 bg-slate-800 text-gray-200" : "border-gray-300 bg-white text-gray-700"}`

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className={`min-h-screen ${dark ? "bg-[#0B1220]" : "bg-gray-50"}`}>
      {/* ── Sticky header ───────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-10 border-b ${
          dark
            ? "border-white/10 bg-[#0F172A]/95 backdrop-blur-md"
            : "border-gray-200 bg-white/95 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Title + live meta */}
            <div className="flex items-center gap-3">
              <div
                className={`hidden sm:block rounded-lg p-2 ${dark ? "bg-blue-500/20" : "bg-blue-100"}`}
              >
                <FileText className={`h-5 w-5 ${dark ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div>
                <h1
                  className={`text-xl font-bold leading-none ${dark ? "text-gray-100" : "text-gray-900"}`}
                >
                  Crear publicación
                </h1>
                <div className={`mt-1 flex items-center gap-3 ${hint}`}>
                  {draft.content && (
                    <span>
                      ~{Math.max(1, Math.round(draft.content.split(/\s+/).length / 200))} min lectura
                    </span>
                  )}
                  {draft.focus_keyword && (
                    <span className={`font-medium ${seoColor}`}>
                      SEO: {seoLabel} ({seoScore}/100)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className={`cursor-pointer bg-transparent ${
                  dark
                    ? "text-gray-300 hover:text-gray-100 border-white/10"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button
                type="submit"
                form="blog-form"
                name="intent"
                value="draft"
                disabled={pending}
                variant="outline"
                className={`cursor-pointer bg-transparent ${
                  dark
                    ? "text-gray-300 hover:text-gray-100 border-white/10"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                <Save className="mr-2 h-4 w-4" />
                {pending ? "Guardando…" : "Borrador"}
              </Button>
              <Button
                type="submit"
                form="blog-form"
                name="intent"
                value="published"
                disabled={pending}
                className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
              >
                <Eye className="mr-2 h-4 w-4" />
                {pending ? "Publicando…" : "Publicar"}
              </Button>
            </div>
          </div>

          {/* Global error banner */}
          {state?.success === false && (
            <div
              className={`mt-3 rounded-lg border px-4 py-2 text-sm ${
                dark
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {state.message}
            </div>
          )}
        </div>
      </header>

      {/* ── 2-column layout ─────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-6">
        <form id="blog-form" action={formAction}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            {/* ── LEFT: main content ──────────────────────────────────── */}
            <div className="space-y-4">
              {/* Title + Slug */}
              <div className={card}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
                  <div>
                    <label className={lbl}>Título *</label>
                    <Input
                      name="title"
                      value={draft.title}
                      onChange={handleTitleChange}
                      placeholder="Ej. Cómo reemplazar el motor de un ventilador"
                      dark={dark}
                      className={state?.fieldErrors?.title ? "border-red-500" : ""}
                    />
                    {state?.fieldErrors?.title && (
                      <p className="mt-1 text-sm text-red-500">{state.fieldErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`mb-1 flex items-center gap-1 text-sm font-medium ${
                        dark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Hash className="h-3.5 w-3.5 text-blue-500" />
                      Slug *
                    </label>
                    <div className="flex gap-2">
                      <Input
                        name="slug"
                        value={draft.slug}
                        onChange={(e) => {
                          setSlugTouched(true)
                          setDraft((d) => ({ ...d, slug: e.target.value }))
                        }}
                        placeholder="como-reemplazar-motor"
                        dark={dark}
                        className={state?.fieldErrors?.slug ? "border-red-500" : ""}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setSlugTouched(false)
                          setDraft((d) => ({ ...d, slug: slugify(d.title) }))
                        }}
                        className={`shrink-0 cursor-pointer bg-transparent text-xs ${
                          dark ? "text-gray-300 border-white/10" : "text-gray-700 border-gray-300"
                        }`}
                      >
                        Auto
                      </Button>
                    </div>
                    {state?.fieldErrors?.slug && (
                      <p className="mt-1 text-sm text-red-500">{state.fieldErrors.slug}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className={card}>
                <label className={lbl}>Resumen / Excerpt</label>
                <Textarea
                  name="excerpt"
                  rows={3}
                  value={draft.excerpt}
                  onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                  placeholder="Un resumen breve para listados y redes sociales…"
                  className={
                    dark
                      ? "bg-slate-800 border-white/10 text-gray-200 placeholder:text-gray-500"
                      : "bg-white border-gray-300 text-gray-700"
                  }
                />
                <p className={`mt-1 ${hint}`}>{draft.excerpt.length}/500</p>
              </div>

              {/* Rich editor */}
              <div className={card}>
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Contenido *
                  </span>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setPreview((p) => !p)}
                    className="h-7 cursor-pointer bg-transparent text-xs"
                  >
                    {preview ? "Editar" : "Vista previa"}
                  </Button>
                </div>

                {preview ? (
                  <article
                    className={`prose max-w-none rounded-lg border p-4 ${
                      dark ? "border-white/10 bg-slate-800 prose-invert" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {/* eslint-disable-next-line react/no-danger */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: draft.content || "<p><i>Sin contenido…</i></p>",
                      }}
                    />
                  </article>
                ) : (
                  <RichEditor
                    value={draft.content}
                    onChange={(html) => setDraft((d) => ({ ...d, content: html }))}
                    dark={dark}
                  />
                )}

                <input type="hidden" name="content" value={draft.content} />
                {state?.fieldErrors?.content && (
                  <p className="mt-1 text-sm text-red-500">{state.fieldErrors.content}</p>
                )}
              </div>
            </div>

            {/* ── RIGHT: sidebar ──────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Image upload */}
              <div className={card}>
                <label
                  className={`mb-2 flex items-center gap-2 text-sm font-medium ${
                    dark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  Imagen de portada *
                </label>
                <Input
                  onChange={handleFileChange}
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  dark={dark}
                />
                {previewUrl && (
                  <div className="mt-3 overflow-hidden rounded-lg">
                    <Image
                      src={previewUrl}
                      alt="Vista previa de portada"
                      width={360}
                      height={180}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Category + Tags */}
              <div className={card}>
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className={lbl}>Categoría *</label>
                    <select name="category" required defaultValue="" className={selectCls}>
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.key} value={cat.cat_model}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label
                      className={`mb-1 flex items-center gap-1 text-sm font-medium ${
                        dark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Tags className="h-3.5 w-3.5 text-blue-500" />
                      Etiquetas
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Escribe y presiona Enter"
                        dark={dark}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleAddTag}
                        className={`shrink-0 cursor-pointer bg-transparent ${
                          dark ? "text-gray-300 border-white/10" : "text-gray-700 border-gray-300"
                        }`}
                      >
                        +
                      </Button>
                    </div>
                    {draft.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {draft.tags.map((t) => (
                          <Badge
                            key={t}
                            onClick={() => handleRemoveTag(t)}
                            className={`cursor-pointer text-xs ${
                              dark
                                ? "bg-blue-500/20 text-blue-400 hover:bg-red-500/20 hover:text-red-400"
                                : "bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            #{t} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                    <input type="hidden" name="tags" value={JSON.stringify(draft.tags)} />
                  </div>
                </div>
              </div>

              {/* SEO Panel */}
              <div className={card}>
                {/* Panel header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-500" />
                    <span
                      className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      SEO
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-semibold ${seoColor}`}>{seoScore}/100</span>
                    <span className={`text-xs ${seoColor}`}> · {seoLabel}</span>
                  </div>
                </div>

                {/* Score bar */}
                <div
                  className={`mb-4 h-1.5 w-full overflow-hidden rounded-full ${
                    dark ? "bg-white/10" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${seoBarColor}`}
                    style={{ width: `${seoScore}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {/* Keyword */}
                  <div>
                    <label className={lbl}>Palabra clave principal</label>
                    <Input
                      name="focus_keyword"
                      value={draft.focus_keyword}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, focus_keyword: e.target.value }))
                      }
                      placeholder="Ej. motor ventilador"
                      dark={dark}
                    />
                  </div>

                  {/* Meta title */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label
                        className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Meta título
                      </label>
                      <span
                        className={`tabular-nums text-xs ${
                          draft.meta_title.length > 60
                            ? "text-red-500"
                            : draft.meta_title.length > 50
                              ? "text-amber-500"
                              : hint
                        }`}
                      >
                        {draft.meta_title.length}/60
                      </span>
                    </div>
                    <Input
                      name="meta_title"
                      value={draft.meta_title}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, meta_title: e.target.value.slice(0, 60) }))
                      }
                      placeholder={draft.title || "Título SEO (≤60 chars)"}
                      dark={dark}
                    />
                  </div>

                  {/* Meta description */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label
                        className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Meta descripción
                      </label>
                      <span
                        className={`tabular-nums text-xs ${
                          draft.meta_description.length > 160
                            ? "text-red-500"
                            : draft.meta_description.length > 140
                              ? "text-amber-500"
                              : hint
                        }`}
                      >
                        {draft.meta_description.length}/160
                      </span>
                    </div>
                    <Textarea
                      name="meta_description"
                      rows={3}
                      value={draft.meta_description}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          meta_description: e.target.value.slice(0, 160),
                        }))
                      }
                      placeholder={draft.excerpt || "Descripción para resultados de búsqueda (≤160 chars)"}
                      className={
                        dark
                          ? "bg-slate-800 border-white/10 text-gray-200 placeholder:text-gray-500"
                          : "bg-white border-gray-300 text-gray-700"
                      }
                    />
                  </div>

                  {/* Robots */}
                  <div>
                    <label className={lbl}>Robots</label>
                    <select
                      name="robots"
                      value={draft.robots}
                      onChange={(e) => setDraft((d) => ({ ...d, robots: e.target.value }))}
                      className={selectCls}
                    >
                      <option value="index, follow">Indexar (index, follow)</option>
                      <option value="noindex, nofollow">No indexar (noindex, nofollow)</option>
                    </select>
                  </div>

                  {/* SERP preview */}
                  <div>
                    <div className={`mb-1.5 flex items-center gap-1 ${hint}`}>
                      <Globe className="h-3 w-3" />
                      Vista previa en Google
                    </div>
                    <div
                      className={`rounded-lg border p-3 ${
                        dark ? "border-white/10 bg-slate-900" : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <p className={`text-xs ${dark ? "text-green-400" : "text-green-700"}`}>
                        refaccionariavega.com{serpUrl}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-medium text-blue-500">
                        {serpTitle.slice(0, 60)}
                        {serpTitle.length > 60 ? "…" : ""}
                      </p>
                      <p
                        className={`mt-1 line-clamp-2 text-xs ${
                          dark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {serpDesc.slice(0, 160)}
                        {serpDesc.length > 160 ? "…" : ""}
                      </p>
                    </div>
                  </div>

                  {/* SEO checklist — shown when keyword is set */}
                  {draft.focus_keyword && (
                    <div
                      className={`space-y-1.5 rounded-lg p-2.5 text-xs ${
                        dark ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <SeoHint
                        ok={draft.title.toLowerCase().includes(draft.focus_keyword.toLowerCase())}
                        text="Keyword en el título"
                        dark={dark}
                      />
                      <SeoHint
                        ok={draft.meta_description
                          .toLowerCase()
                          .includes(draft.focus_keyword.toLowerCase())}
                        text="Keyword en la meta descripción"
                        dark={dark}
                      />
                      <SeoHint
                        ok={draft.meta_description.length >= 50}
                        text="Meta descripción larga (≥50 chars)"
                        dark={dark}
                      />
                      <SeoHint
                        ok={draft.tags.length > 0}
                        text="Al menos una etiqueta"
                        dark={dark}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeoHint({ ok, text, dark }: { ok: boolean; text: string; dark: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 ${
        ok
          ? dark
            ? "text-green-400"
            : "text-green-600"
          : dark
            ? "text-gray-500"
            : "text-gray-400"
      }`}
    >
      <span className="font-mono">{ok ? "✓" : "○"}</span>
      <span>{text}</span>
    </div>
  )
}
