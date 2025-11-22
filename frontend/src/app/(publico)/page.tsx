import React from 'react';
import HeroSection from '@/components/ui/layout/Hero';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import Categories from '@/components/product/Categories';
import Brands from '@/components/product/Brands';
import { Carousel } from '@/components/features/home/carousel';
import Features from '@/components/features/home/Features';
import { Reviews } from '@/components/features/reviews/Reviews';

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