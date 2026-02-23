'use server'

import axios from 'axios'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { CreatePostType } from '@/shared/types/blog'

const URL = process.env.NEXT_PUBLIC_BASE_URL_API

export const postBlog = async (newPost: CreatePostType) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    try {
        await axios.post(`${URL}/blog/posts/`, newPost, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
    } catch (error: unknown) {
        throw error
    }
}

export const getBlogPostBySlug = cache(async (slug: string) => {
    const res = await fetch(`${URL}/blog/post/${slug}/`, {
        next: { revalidate: 60 }
    })
    if (res.status === 404) notFound()
    if (!res.ok) throw new Error('Failed to fetch blog post')
    return res.json()
})

export default postBlog
