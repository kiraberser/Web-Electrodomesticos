'use client'

import Link from "next/link";
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
const axios = require('axios').default;

const TOKEN = process.env.NEXT_PUBLIC_API_KEY

// Configurar axios globalmente

type BlogPost = {
    title: string,
    description: string,
    category: string,
    slug: string,
    created_at: string,
    content: string,
    author?: string,
    image?: string
}

const BlogPost = () => {
    console.log(TOKEN)
    const params = useParams()
    const [post, setPost] = useState<BlogPost | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log('Fetching post with slug:', params)
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/blog/post/${params.slug}/`)
                setPost(response.data)
                setError(null)
            } catch (error: any) {
                console.error('Error fetching post:', error)
                setError(error.message || 'Error al cargar el post')
                if (error.response) {
                    console.error('Response data:', error.response.data)
                    console.error('Response status:', error.response.status)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [params.slug])

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    Post no encontrado
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4 min-h-screen">
            <article className="prose lg:prose-xl">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-sm text-blue-600">{post.category}</span>
                    <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                    {post.author && <span className="text-sm text-gray-600">Por {post.author}</span>}
                </div>

                {post.image && (
                    <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                )}

                <div className="text-gray-600 mb-4">{post.description}</div>
                
                <div className="prose prose-lg">
                    {post.content}
                </div>
            </article>
            <Link
                href={"/blog/"}
                className="w-5 h-5 bg-white p-3 rounded-md border hover:bg-gray-100"
            >
                Ir al Blog
            </Link>
        </div>
    )
}

export default BlogPost
