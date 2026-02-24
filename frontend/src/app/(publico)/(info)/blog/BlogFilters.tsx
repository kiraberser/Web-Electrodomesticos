'use client'

import Image from 'next/image';
import { Button } from '@/shared/ui/forms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/display/Card';
import { Badge } from '@/shared/ui/feedback/Badge';
import { Input } from '@/shared/ui/forms/InputField';
import { Calendar, User, Search, ArrowRight, Eye, MessageSquare } from 'lucide-react';

import { useState, useMemo } from 'react';
import { blogPosts } from '@/shared/data/blog';
import { categories } from '@/shared/data/category';

export default function BlogFilters() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const featuredPosts = useMemo(() => blogPosts.filter(post => post.featured), []);

    const filteredPosts = useMemo(() => blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' ||
            (selectedCategory !== 'all' && categories.find(c => String(c.id) === selectedCategory)?.label === post.category);

        return matchesSearch && matchesCategory;
    }), [searchTerm, selectedCategory]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = useMemo(() => filteredPosts.slice(indexOfFirstPost, indexOfLastPost), [filteredPosts, indexOfFirstPost, indexOfLastPost]);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    interface BlogCardProps {
        post: typeof blogPosts[0];
        featured?: boolean;
    }

    const BlogCard = ({ post, featured = false }: BlogCardProps) => (
        <Card className={`group hover:shadow-lg transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
            <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white">
                        {post.category}
                    </Badge>
                </div>
            </div>
            <CardHeader>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.date)}</span>
                    </div>
                </div>
                <p className={`font-semibold group-hover:text-blue-600 transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
                    {post.title}
                </p>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-blue-50 group-hover:text-blue-600">
                        Leer más
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        {/* Categories */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="text-lg">Categorías</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {categories.map((category) => {
                                        const postCount = blogPosts.filter(post => post.category === category.label).length;
                                        const categoryKey = String(category.id);
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(categoryKey)}
                                                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === categoryKey
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{category.label}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {postCount}
                                                    </Badge>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Posts */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Artículos Populares</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {blogPosts
                                        .slice()
                                        .sort((a, b) => b.views - a.views)
                                        .slice(0, 3)
                                        .map((post) => (
                                            <div key={post.id} className="flex space-x-3 group cursor-pointer">
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover rounded-md"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                                        <span>{formatDate(post.date)}</span>
                                                        <span>•</span>
                                                        <div className="flex items-center space-x-1">
                                                            <Eye className="w-3 h-3" />
                                                            <span>{post.views}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Featured Posts */}
                    {searchTerm === '' && selectedCategory === 'all' && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Artículos Destacados
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {featuredPosts.slice(0, 3).map((post, index) => (
                                    <BlogCard key={post.id} post={post} featured={index === 0} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los Artículos'}
                        </h2>
                        <p className="text-gray-600">
                            {filteredPosts.length} artículos
                        </p>
                    </div>

                    {/* Blog Posts Grid */}
                    {currentPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No se encontraron artículos
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Intenta ajustar los filtros o buscar algo diferente
                            </p>
                            <Button onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}>
                                Limpiar filtros
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {currentPosts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>

                            {[...Array(totalPages)].map((_, index) => (
                                <Button
                                    key={index + 1}
                                    variant={currentPage === index + 1 ? 'default' : 'outline'}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className="w-10 h-10 p-0"
                                >
                                    {index + 1}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
