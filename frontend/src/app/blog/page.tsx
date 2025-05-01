'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
const axios = require('axios').default;

const TOKEN = process.env.NEXT_PUBLIC_API_KEY


// Configurar axios globalmente
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

type GetBlog = {
    title: string,
    description: string,
    category: string,
    slug: string,
    created_at: string
}

const Blog = () => {
    const [data, setData] = useState<GetBlog[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    console.log(TOKEN)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await instance.get('/api/v1/blog/posts/')
                setData(response.data)
                //localStorage.setItem('blogToken', instance.defaults.headers.common['Authorization'])
                setError(null)
            } catch (error: any) {
                console.error('Error fetching posts:', error)
                setError(error.message || 'Error al cargar los posts')
                if (error.response) {
                    console.error('Response data:', error.response.data)
                    console.error('Response status:', error.response.status)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>/g, '');
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Blog
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Descubre las últimas noticias y artículos sobre electrodomésticos y refacciones
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                        {error}
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {data.map((post) => (
                        <Link 
                            key={post.slug} 
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {post.category}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(post.created_at)}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                    {post.title}
                                </h2>
                                <p className="mt-3 text-gray-600 line-clamp-3">
                                    {stripHtml(post.description)}
                                </p>
                                <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-800 transition-colors duration-300">
                                    Leer más
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {data.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay posts disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Blog