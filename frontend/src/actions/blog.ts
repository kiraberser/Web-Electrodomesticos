"use server"

import {uploadImage} from '@/lib/cloudinary'
import {postBlog} from '@/api/blog'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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
    const image = formData.get('image') as File
    const tagsRaw = formData.get('tags')
    const content = ((formData.get("content") as string) || "").trim()
    const category = ((formData.get("category") as string) || "").trim()

    if (image === null) {
        return new Error('No se ha seleccionado una imagen')
    }

    const fieldErrors: BlogActionState["fieldErrors"] = {}
    if (!title) fieldErrors.title = "El título es requerido"
    if (!slug) fieldErrors.slug = "El slug es requerido"
    if (!content) fieldErrors.content = "El contenido es requerido"

    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, message: "Revisa los campos marcados", fieldErrors }
    }

    let errors = []

    let imageUrl;

    try {
        console.log('esta es la imagen', image)
        imageUrl = await uploadImage(image)
    } catch (error){
        console.error( 'Error al subir la imagen', error)
        errors.push('Error al subir la imagen')
    }


    const newPost = {
        title: title,
        description: content,
        image: imageUrl,
        resume: excerpt,
        autor: 1,
        tags: tagsRaw,
        category: category
    }

    console.log(newPost)

    await postBlog(newPost)

    console.log('Post creado con exito')

    revalidatePath('/blog')
    redirect('/')
}
