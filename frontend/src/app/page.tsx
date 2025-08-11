import React from 'react';
import HeroSection from '@/components/ui/layout/Hero';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import Categories from '@/components/product/Categories';
import { Carousel } from '@/components/features/home/carousel';
import Features from '@/components/features/home/Features';
import Brands from '@/components/product/Brands';
import { Reviews } from '@/components/features/reviews/Reviews';

//Falta import Features, Testimonials, Brands



const HomePage = () => {
  return (
    <div className="min-h-screen">
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