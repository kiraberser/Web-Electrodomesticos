"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useActionState } from "react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Badge } from "@/components/ui/feedback/Badge"
import { Textarea } from "@/components/ui/display/Textarea"
import dynamic from "next/dynamic"

const RichEditor = dynamic(() => import("@/components/blog/ckeditor"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />
})
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { FileText, Hash, Tags, ImageIcon, Save, Eye, ArrowLeft } from "lucide-react"
import { createPost, type BlogActionState } from "@/actions/blog"
import { categories } from "@/data/category"

type BlogDraft = {
  title: string
  slug: string
  tags: string[]
  image: string | File | null
  excerpt: string
  content: string
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

const initialState: BlogActionState = { success: undefined, message: undefined }

export default function CrearBlogPage() {
  const router = useRouter()
  const { dark } = useAdminTheme()

  const [draft, setDraft] = useState<BlogDraft>({
    title: "",
    slug: "",
    tags: [],
    image: "",
    excerpt: "",
    content: "",
  })
  const [tagInput, setTagInput] = useState("")
  const [preview, setPreview] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Server Action with useActionState (manejo de errores esperados recomendado) [^1]
  const [state, formAction, pending] = useActionState<BlogActionState, FormData>(createPost, initialState)

  const handleAddTag = () => {
    const t = tagInput.trim()
    if (!t) return
    if (draft.tags.includes(t)) return
    setDraft((d) => ({ ...d, tags: [...d.tags, t] }))
    setTagInput("")
  }

  const handleRemoveTag = (t: string) => {
    setDraft((d) => ({ ...d, tags: d.tags.filter((x) => x !== t) }))
  }

  const handleAutoSlug = () => {
    if (!draft.title) return
    setDraft((d) => ({ ...d, slug: slugify(d.title) }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setDraft((d) => ({ ...d, image: selectedFile }))
  };

  return (
    <main className={`min-h-screen ${dark ? 'bg-[#0B1220]' : 'bg-gray-50'}`}>
      {/* Encabezado */}
      <section className={`border-b ${dark ? 'border-white/10 bg-[#0F172A]' : 'border-gray-200 bg-white'}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className={`hidden sm:block rounded-lg p-2 ${dark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <FileText className={`h-5 w-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>Crear publicación</h1>
                <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Escribe, edita y publica con un editor moderno.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className={`cursor-pointer bg-transparent ${dark ? 'text-gray-300 hover:text-gray-100 border-white/10' : 'text-gray-700 hover:text-gray-900 border-gray-300'}`}
                aria-label="Volver"
              >
                <ArrowLeft className={`mr-2 h-4 w-4 ${dark ? 'text-gray-300' : 'text-gray-700'}`} />
                Volver
              </Button>
              {/* Draft submit */}
              <Button
                type="submit"
                form="blog-form"
                name="intent"
                value="draft"
                disabled={pending}
                variant="outline"
                className={`cursor-pointer bg-transparent ${dark ? 'text-gray-300 hover:text-gray-100 border-white/10' : 'text-gray-700 hover:text-gray-900 border-gray-300'}`}
              >
                <Save className={`mr-2 h-4 w-4 ${dark ? 'text-gray-300' : 'text-gray-700'}`} />
                {pending ? "Guardando…" : "Guardar borrador"}
              </Button>
              {/* Publish submit */}
              <Button
                type="submit"
                form="blog-form"
                name="intent"
                value="published"
                disabled={pending}
                className="bg-blue-600 text-white cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                {pending ? "Publicando…" : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="container mx-auto gap-6 px-4 py-6 m-4">
        {/* Form + Editor */}
        <div className="space-y-4">
          <form id="blog-form" action={formAction} className="space-y-4">
            {/* Título y slug */}
            <div className={`rounded-xl border p-4 ${dark ? 'border-white/10 bg-[#0F172A]' : 'border-gray-200 bg-white'}`}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px]">
                <div>
                  <label className={`mb-1 block text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Título</label>
                  <Input
                    name="title"
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Ej. Cómo reemplazar el motor de un ventilador"
                    dark={dark}
                    className={state?.fieldErrors?.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  />
                  {state?.fieldErrors?.title && <p className={`mt-1 text-sm ${dark ? 'text-red-400' : 'text-red-600'}`}>{state.fieldErrors.title}</p>}
                </div>
                <div>
                  <label className={`mb-1 flex items-center gap-2 text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Hash className={`h-4 w-4 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                    Slug
                  </label>
                  <div className="flex gap-2">
                    <Input
                      name="slug"
                      value={draft.slug}
                      onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                      placeholder="como-reemplazar-motor-ventilador"
                      dark={dark}
                      className={state?.fieldErrors?.slug ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleAutoSlug}
                      className={`shrink-0 cursor-pointer bg-transparent ${dark ? 'text-gray-300 hover:text-gray-100 border-white/10' : 'text-gray-700 hover:text-gray-900 border-gray-300'}`}
                    >
                      Auto
                    </Button>
                  </div>
                  {state?.fieldErrors?.slug && <p className={`mt-1 text-sm ${dark ? 'text-red-400' : 'text-red-600'}`}>{state.fieldErrors.slug}</p>}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className={`mb-1 block text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Categoría</label>
              <select
                name="category"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-white/10 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white text-gray-700'}`}
                defaultValue=""
                required
              >
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

            {/* Excerpt y portada */}
            <div className={`rounded-xl border p-4 ${dark ? 'border-white/10 bg-[#0F172A]' : 'border-gray-200 bg-white'}`}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Resumen (excerpt)</label>
                  <Textarea
                    name="excerpt"
                    rows={4}
                    value={draft.excerpt}
                    onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                    placeholder="Un resumen breve para mostrar en listados…"
                    className={dark ? 'bg-slate-800 border-white/10 text-gray-200 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-700'}
                  />
                </div>
                <div>
                  <label className={`mb-1 flex items-center gap-2 text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ImageIcon className={`h-4 w-4 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                    Seleccionar Imagen
                  </label>
                  <Input
                    onChange={handleFileChange}
                    name="image"
                    type="file"
                    required
                    dark={dark}
                  />
                </div>
                {file && (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Vista previa"
                    width={256}
                    height={128}
                    className="mt-2 h-32 rounded-lg object-cover"
                  />
                )}

              </div>
            </div>

            {/* Tags */}
            <div className={`rounded-xl border p-4 ${dark ? 'border-white/10 bg-[#0F172A]' : 'border-gray-200 bg-white'}`}>
              <label className={`mb-1 flex items-center gap-2 text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Tags className={`h-4 w-4 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                Etiquetas
              </label>
              <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Ej. ventiladores, reparación"
                    dark={dark}
                  />
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleAddTag}
                  className={`cursor-pointer bg-transparent ${dark ? 'text-gray-300 hover:text-gray-100 border-white/10' : 'text-gray-700 hover:text-gray-900 border-gray-300'}`}
                >
                  Agregar
                </Button>
              </div>
              {draft.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {draft.tags.map((t) => (
                    <Badge
                      key={t}
                      onClick={() => handleRemoveTag(t)}
                      className={`cursor-pointer ${dark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                    >
                      #{t}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Enviamos tags como JSON en un campo oculto */}
              <input type="hidden" name="tags" value={JSON.stringify(draft.tags)} />
            </div>

            {/* CKEditor */}
            <div className={`rounded-xl border p-4 ${dark ? 'border-white/10 bg-[#0F172A]' : 'border-gray-200 bg-white'}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Contenido</span>
                <div className={`flex items-center gap-3 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setPreview((p) => !p)}
                    className="h-7 cursor-pointer bg-transparent"
                  >
                    {preview ? "Editar" : "Vista previa"}
                  </Button>
                </div>
              </div>

              {preview ? (
                <article className={`prose max-w-none rounded-lg border p-4 ${dark ? 'border-white/10 bg-slate-800 prose-invert' : 'border-gray-200 bg-gray-50'}`}>
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: draft.content || "<p><i>Sin contenido…</i></p>" }} />
                </article>
              ) : (
                <RichEditor value={draft.content} onChange={(html) => setDraft((d) => ({ ...d, content: html }))} dark={dark} />
              )}

              {/* Campo oculto para enviar el HTML del editor al Server Action */}
              <input type="hidden" name="content" value={draft.content} />
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
