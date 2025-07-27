'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/display/Card';
import { Badge } from '../ui';
import { Loader2 } from 'lucide-react';

import { categories } from '@/data/category';

const Categories = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorías Populares</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explora nuestra amplia selección de electrodomésticos organizados por categorías
                        </p>
                    </div>
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Cargando categorías...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorías Populares</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Categorías Populares
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explora nuestra amplia selección de electrodomésticos organizados por categorías
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                        >
                            <CardContent className="p-4 text-center">
                                <div className="relative mb-4">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-24 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                                    {category.name}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                    {category.product_count} productos
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;