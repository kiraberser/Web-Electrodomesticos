import Link from "next/link";
import Image from "next/image";
import { getBlogPostBySlug } from "@/features/blog/api";
import type { Metadata } from "next";

type BlogPost = {
    title: string;
    description: string;
    category: string;
    slug: string;
    created_at: string;
    updated_at?: string;
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

const BASE = 'https://www.refaccionariavega.com.mx'

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    try {
        const post: BlogPost = await getBlogPostBySlug(slug)
        return {
            title: post.title,
            description: post.description,
            alternates: {
                canonical: `${BASE}/blog/${slug}`,
            },
            openGraph: {
                title: post.title,
                description: post.description,
                type: 'article',
                publishedTime: post.created_at,
                modifiedTime: post.updated_at,
                images: post.image ? [{ url: post.image }] : undefined,
            },
        }
    } catch {
        return {
            title: 'Artículo',
            description: 'Artículo del blog de Refaccionaria Vega.',
            alternates: { canonical: `${BASE}/blog/${slug}` },
        }
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post: BlogPost = await getBlogPostBySlug(slug)

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        ...(post.image ? { image: post.image } : {}),
        datePublished: post.created_at,
        dateModified: post.updated_at ?? post.created_at,
        author: post.author
            ? { '@type': 'Person', name: post.author }
            : { '@type': 'Organization', name: 'Refaccionaria Vega', url: BASE },
        publisher: {
            '@type': 'Organization',
            name: 'Refaccionaria Vega',
            url: BASE,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE}/logo.svg`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE}/blog/${slug}`,
        },
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE}/blog/${slug}` },
        ],
    }

    return (
        <div className="max-w-4xl mx-auto p-4 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <article className="prose lg:prose-xl">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-sm text-blue-600">{post.category}</span>
                    <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                    {post.author && <span className="text-sm text-gray-600">Por {post.author}</span>}
                </div>

                {post.image && (
                    <div className="relative w-full h-64 mb-6">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover rounded-lg"
                            sizes="(max-width: 896px) 100vw, 896px"
                        />
                    </div>
                )}

                <div className="text-gray-600 mb-4">{post.description}</div>

                <div
                    className="prose prose-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
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
