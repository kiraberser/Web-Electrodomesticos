import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/ui/layout/Hero';
import Categories from '@/components/product/Categories';
import Brands from '@/components/product/Brands';
import Features from '@/components/features/home/Features';

const FeaturedProducts = dynamic(() => import('@/components/product/FeaturedProducts'), {
  loading: () => <section className="py-16 bg-gray-50"><div className="container mx-auto px-4"><div className="h-96 animate-pulse rounded-xl bg-gray-200" /></div></section>,
});

const Carousel = dynamic(() => import('@/components/features/home/carousel').then(m => ({ default: m.Carousel })), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});

const Reviews = dynamic(() => import('@/components/features/reviews/Reviews').then(m => ({ default: m.Reviews })), {
  loading: () => <section className="py-16 bg-gray-900"><div className="container mx-auto px-4"><div className="h-80 animate-pulse rounded-xl bg-gray-800" /></div></section>,
});

export const metadata = {
  title: 'Refaccionaria Vega - Electrodomésticos y Refacciones',
  description: 'Encuentra las mejores refacciones y electrodomésticos para tu hogar. Calidad garantizada y envíos a toda la república mexicana.',
};

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <Categories />
      <Carousel />
      <FeaturedProducts />
      <Features />
      <Reviews/>
      <Brands />
    </div>
  );
};

export default HomePage;