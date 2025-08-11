"use server"

export type BlogActionState = {
    success?: boolean
    message?: string
    id?: string
    fieldErrors?: Partial<Record<"title" | "slug" | "content", string>>
}

export async function createPost(prevState: BlogActionState, formData: FormData): Promise<BlogActionState> {
    const title = ((formData.get("title") as string) || "").trim()
    const slug = ((formData.get("slug") as string) || "").trim()
    const excerpt = ((formData.get("excerpt") as string) || "").trim()
    const coverUrl = ((formData.get("coverUrl") as string) || "").trim()
    const tagsRaw = ((formData.get("tags") as string) || "[]").trim()
    const status = ((formData.get("intent") as string) || "draft").trim()
    const content = ((formData.get("content") as string) || "").trim()

    const fieldErrors: BlogActionState["fieldErrors"] = {}
    if (!title) fieldErrors.title = "El título es requerido"
    if (!slug) fieldErrors.slug = "El slug es requerido"
    if (!content) fieldErrors.content = "El contenido es requerido"

    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, message: "Revisa los campos marcados", fieldErrors }
    }

    // Parse tags (permitimos JSON o CSV)
    let tags: string[] = []
    try {
        tags = JSON.parse(tagsRaw)
        if (!Array.isArray(tags)) throw new Error("Invalid tags")
    } catch {
        tags = tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
    }

    // Simula guardado en BD
    await new Promise((res) => setTimeout(res, 700))

    // Genera ID si no hay (usar slug como id)
    const id = slug || Math.random().toString(36).slice(2)

    // Aquí podrías conectar a tu base de datos real y persistir:
    // await db.insert({ title, slug, excerpt, coverUrl, tags, content, status })

    return {
        success: true,
        id,
        message: status === "published" ? "Publicado" : "Guardado como borrador",
    }
}
