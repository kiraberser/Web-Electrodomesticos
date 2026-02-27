'use server'

import axios from 'axios'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { CreatePostType } from '@/shared/types/blog'

const BASE = process.env.NEXT_PUBLIC_BASE_URL_API

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
    const res = await fetch(`${BASE}/blog/posts/${slug}/`, {
        next: { revalidate: 60 },
    })
    if (res.status === 404) notFound()
    if (!res.ok) throw new Error('Failed to fetch blog post')
    return res.json()
})

export default postBlog
