'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/forms/Button';
import { Card, CardContent } from '../ui/display/Card';
import { Badge } from '../ui';
import { Star, ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Toast as toast } from '../ui/feedback/Toasts';

import { products } from '@/data/products';

const FeaturedProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { addItem } = useCart();



    const handleAddToCart = (product) => {
        addItem(product);
        toast({
            title: "Producto agregado",
            description: `${product.name} ha sido agregado al carrito`,
        });
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 3));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(products.length / 3)) % Math.ceil(products.length / 3));
    };

    const getVisibleProducts = () => {
        const start = currentIndex * 3;
        return products.slice(start, start + 3);
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubre nuestras mejores ofertas en electrodomésticos de alta calidad
                        </p>
                    </div>
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Cargando productos...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Reintentar
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
                        <p className="text-gray-600">No hay productos destacados disponibles en este momento.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Productos Destacados
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Descubre nuestras mejores ofertas en electrodomésticos de alta calidad
                    </p>
                </div>

                {/* Products Carousel */}
                <div className="relative">
                    <div className="grid md:grid-cols-3 gap-6">
                        {getVisibleProducts().map((product) => (
                            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-orange-500 text-white">
                                                {product.discount}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-white/80 hover:bg-white"
                                            >
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-2">
                                            <Badge variant="outline" className="text-xs">
                                                {product.category}
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500 ml-2">
                                                ({product.rating})
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ${product.price}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through">
                                                    ${product.original_price}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            size="sm"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Agregar al carrito
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    {products.length > 3 && (
                        <>
                            <div className="flex justify-center mt-8 space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={prevSlide}
                                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={nextSlide}
                                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                >
                                    Siguiente
                                </Button>
                            </div>

                            {/* Dots indicator */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {Array.from({ length: Math.ceil(products.length / 3) }).map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href="/productos">
                        <Button
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                        >
                            Ver todos los productos
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;