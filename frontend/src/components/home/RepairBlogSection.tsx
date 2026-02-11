import Image from 'next/image'
import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { blogPosts } from '@/data/blog'

export default function RepairBlogSection() {
  const posts = blogPosts.slice(0, 4)

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Wrench className="w-6 h-6 text-[#0A3981]" />
          <h2 className="text-2xl font-bold text-[#0A3981] uppercase tracking-wide">
            Cómo Reparar tu Electrodoméstico
          </h2>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="rounded-xl border-2 border-gray-100 overflow-hidden hover:border-[#0A3981]/30 transition-colors duration-200">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0A3981] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#0A3981] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <span className="text-xs font-semibold text-[#E38E49] group-hover:underline">
                    Leer más
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
