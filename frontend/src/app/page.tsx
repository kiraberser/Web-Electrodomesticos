import React from 'react';
import HeroSection from '@/components/ui/layout/Hero';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import Categories from '@/components/product/Categories';

//Falta import Features, Testimonials, Brands

import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Brands from '../components/Brands';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <Features />
      <Testimonials />
      <Brands />
    </div>
  );
};

export default HomePage;