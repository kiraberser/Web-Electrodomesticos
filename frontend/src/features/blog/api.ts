'use server'

import axios from 'axios'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { CreatePostType } from '@/shared/types/blog'

const BASE = process.env.NEXT_PUBLIC_BASE_URL_API

export type BlogPostSummary = {
    id: number
    title: string
    slug: string
    description: string
    content: string
    author?: string
    image?: string
    category: string
    created_at: string
    updated_at?: string
    tags?: string[]
}

export const getBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
    try {
        const res = await fetch(`${BASE}/blog/posts/`, {
            next: { revalidate: 300 },
        })
        if (!res.ok) return []
        const data = await res.json()
        return data.results ?? data
    } catch {
        return []
    }
})

export const postBlog = async (newPost: CreatePostType) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    await axios.post(`${BASE}/blog/posts/`, newPost, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
}

export const getBlogPostBySlug = cache(async (slug: string) => {
    let res: Response
    try {
        res = await fetch(`${BASE}/blog/posts/${slug}/`, {
            next: { revalidate: 60 },
        })
    } catch {
        // Red caída o backend no disponible
        notFound()
    }
    if (!res!.ok) notFound()
    return res!.json()
})

export default postBlog
