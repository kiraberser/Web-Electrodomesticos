import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { brands_data as brands } from '@/data/brands';

const Brands = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Marcas de Confianza
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Trabajamos con las mejores marcas del mercado para ofrecerte productos de calidad
                    </p>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className="group hover:scale-110 transition-transform duration-300 cursor-pointer"
                        >
                            <div className="bg-gray-50 rounded-lg p-6 h-24 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Brands;