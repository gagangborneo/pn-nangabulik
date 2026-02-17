'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  tag: string | null;
  imageUrl: string;
  overlayColor: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      const activeSlides = (data.slides || []).filter((slide: HeroSlide) => slide.isActive);
      setSlides(activeSlides);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    goToSlide(newIndex);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-red-700 h-[500px] md:h-[600px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    // Fallback if no slides available
    return (
      <section
        id="beranda"
        className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-red-700"
      >
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-800/70 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              Resmi & Terpercaya
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Pengadilan Negeri Nanga Bulik
            </h2>
            <p className="text-lg md:text-xl text-red-50 mb-8 leading-relaxed">
              Melayani dengan integritas dan profesionalisme untuk mewujudkan keadilan bagi seluruh masyarakat
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section
      id="beranda"
      className="relative overflow-hidden h-[500px] md:h-[600px]"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.imageUrl}')` }}
            ></div>

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: slide.overlayColor || 'rgba(139, 0, 0, 0.75)',
              }}
            ></div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-20">
              <div className="max-w-3xl">
                {/* Tag/Badge */}
                {slide.tag && (
                  <span className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {slide.tag}
                  </span>
                )}

                {/* Title */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                {slide.subtitle && (
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-red-50 mb-4 animate-fade-in-delay-1">
                    {slide.subtitle}
                  </h3>
                )}

                {/* Description */}
                {slide.description && (
                  <p className="text-base md:text-lg text-red-50 mb-8 leading-relaxed max-w-2xl animate-fade-in-delay-2">
                    {slide.description}
                  </p>
                )}

                {/* CTA Button */}
                {slide.buttonText && slide.buttonUrl && (
                  <div className="animate-fade-in-delay-3">
                    {slide.buttonUrl.startsWith('http') ? (
                      <a href={slide.buttonUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="lg"
                          className="bg-white text-red-900 hover:bg-red-50 rounded-lg px-8 py-6 text-base font-semibold h-auto"
                        >
                          {slide.buttonText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </a>
                    ) : (
                      <Link href={slide.buttonUrl}>
                        <Button
                          size="lg"
                          className="bg-white text-red-900 hover:bg-red-50 rounded-lg px-8 py-6 text-base font-semibold h-auto"
                        >
                          {slide.buttonText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 w-2 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in-delay-1 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.2s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.4s forwards;
        }

        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.6s forwards;
        }
      `}</style>
    </section>
  );
}
