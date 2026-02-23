import Link from "next/link";
import Image from "next/image";
import { getBlogPostBySlug } from "@/features/blog/api";

type BlogPost = {
    title: string;
    description: string;
    category: string;
    slug: string;
    created_at: string;
    content: string;
    author?: string;
    image?: string;
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post: BlogPost = await getBlogPostBySlug(slug)

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
                    <Image
                        src={post.image}
                        alt={post.title}
                        width={1200}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                )}

                <div className="text-gray-600 mb-4">{post.description}</div>

                <div className="prose prose-lg">
                    {post.content}
                </div>
            </article>
            <Link
                href="/blog/"
                className="w-5 h-5 bg-white p-3 rounded-md border hover:bg-gray-100"
            >
                Ir al Blog
            </Link>
        </div>
    )
}
