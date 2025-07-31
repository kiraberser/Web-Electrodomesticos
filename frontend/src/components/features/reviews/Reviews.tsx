'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/display/Card';
import { Star, Quote, Loader2 } from 'lucide-react';

import { testimonials_data as testimonials} from '@/data/testimonials';

export const Reviews = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        if (testimonials.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            }, 5000); // Auto-rotate every 5 seconds

            return () => clearInterval(timer);
        }
    }, [testimonials.length]);


    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Miles de clientes satisfechos respaldan nuestra calidad y servicio
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="relative overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-4">
                                    <Card className="bg-white">
                                        <CardContent className="p-8 text-center">
                                            <div className="mb-6">
                                                <Quote className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                                    "{testimonial.comment}"
                                                </p>
                                                <div className="flex justify-center mb-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${i < testimonial.rating
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                                />
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">
                                                        {testimonial.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {testimonial.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-gray-600">←</span>
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-gray-600">→</span>
                    </button>

                    {/* Dots indicator */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                        <div className="text-gray-300">Clientes satisfechos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">4.8</div>
                        <div className="text-gray-300">Calificación promedio</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">20+</div>
                        <div className="text-gray-300">Años de experiencia</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">500+</div>
                        <div className="text-gray-300">Productos disponibles</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

