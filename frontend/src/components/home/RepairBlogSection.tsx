import Image from 'next/image'
import Link from 'next/link'
import { Wrench, ArrowRight, Clock, Eye } from 'lucide-react'
import { blogPosts } from '@/data/blog'

export default function RepairBlogSection() {
  const [hero, ...rest] = blogPosts.slice(0, 4)

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#0A3981] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-[#E38E49] uppercase tracking-widest">Blog</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0A3981]">
              Cómo Reparar tu Electrodoméstico
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#0A3981] hover:text-[#E38E49] transition-colors"
          >
            Ver todos los artículos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Layout: hero post left + 3 compact posts right */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Hero post — takes 3 cols */}
          <Link href={`/blog/${hero.slug}`} className="lg:col-span-3 group">
            <article className="relative h-full rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-64 lg:h-full lg:min-h-[360px] overflow-hidden">
                <Image
                  src={hero.image}
                  alt={hero.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block bg-[#E38E49] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
                    {hero.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-snug mb-2 group-hover:text-[#E38E49] transition-colors">
                    {hero.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-3">{hero.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {hero.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {hero.date}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>

          {/* Side posts — takes 2 cols, stacked vertically */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.slice(0, 3).map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex-1">
                <article className="flex gap-4 h-full rounded-xl bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-[#E38E49] uppercase tracking-wider mb-1">
                      {post.category}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#0A3981] transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        {post.views.toLocaleString()}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile "Ver todos" */}
        <div className="mt-6 md:hidden text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A3981] hover:text-[#E38E49] transition-colors"
          >
            Ver todos los artículos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
