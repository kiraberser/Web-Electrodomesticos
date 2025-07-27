'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { slides } from '@/data/carouselData'


export const Carousel = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrent((current + 1) % slides.length)
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length)

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-md bg-[#D4EBF8] m-10 ">
      {/* Slides */}
      <div className="bg-[#D4EBF8] flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-[300px] md:h-[450px] relative">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
              <p className="mt-2 text-sm md:text-lg">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#0A3981] p-2 rounded-full hover:bg-white transition cursor-pointer">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#0A3981] p-2 rounded-full hover:bg-white transition cursor-pointer">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full ${i === current ? 'bg-[#E38E49]' : 'bg-white/50'} transition`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel