"use server"

import { uploadImage } from '@/shared/lib/cloudinary'
import { postBlog } from '@/features/blog/api'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type BlogActionState = {
    success?: boolean
    message?: string
    fieldErrors?: Partial<Record<"title" | "slug" | "content", string>>
}

export async function createPost(
    prevState: BlogActionState,
    formData: FormData,
): Promise<BlogActionState> {
    const title    = ((formData.get("title")    as string) || "").trim()
    const slug     = ((formData.get("slug")     as string) || "").trim()
    const excerpt  = ((formData.get("excerpt")  as string) || "").trim()
    const content  = ((formData.get("content")  as string) || "").trim()
    const category = ((formData.get("category") as string) || "").trim()
    const intent   = ((formData.get("intent")   as string) || "draft").trim()
    const tagsRaw  =  (formData.get("tags")     as string) || "[]"
    const image    =   formData.get("image")    as File

    const meta_title       = ((formData.get("meta_title")       as string) || "").trim()
    const meta_description = ((formData.get("meta_description") as string) || "").trim()
    const focus_keyword    = ((formData.get("focus_keyword")    as string) || "").trim()
    const robots           = ((formData.get("robots")           as string) || "index, follow").trim()

    if (!image || !(image instanceof File) || image.size === 0) {
        return { success: false, message: 'No se ha seleccionado una imagen' }
    }

    const fieldErrors: BlogActionState["fieldErrors"] = {}
    if (!title)   fieldErrors.title   = "El título es requerido"
    if (!slug)    fieldErrors.slug    = "El slug es requerido"
    if (!content) fieldErrors.content = "El contenido es requerido"

    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, message: "Revisa los campos marcados", fieldErrors }
    }

    let imageUrl: string
    try {
        imageUrl = await uploadImage(image)
    } catch (error) {
        console.error('Error al subir la imagen:', error)
        return { success: false, message: 'Error al subir la imagen' }
    }

    let tags: string[] = []
    try {
        tags = JSON.parse(tagsRaw)
    } catch {
        tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    }

    try {
        await postBlog({
            title,
            description: content,
            image: imageUrl,
            resume: excerpt,
            tags,
            category,
            slug,
            status: intent as 'draft' | 'published',
            meta_title,
            meta_description,
            focus_keyword,
            robots,
        })
    } catch (error) {
        console.error('Error al crear el post:', error)
        return { success: false, message: 'Error al crear el post' }
    }

    revalidatePath('/blog')
    redirect('/admin/blog')
}
