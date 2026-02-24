'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InformationSlide {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

export default function InformationSlidesSection() {
  const [slides, setSlides] = useState<InformationSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/information-slides');
      const data = await response.json();
      const activeSlides = (data.slides || []).filter((slide: InformationSlide) => slide.isActive);
      setSlides(activeSlides);
    } catch (error) {
      console.error('Error fetching information slides:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || slides.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Get slides to display (3 for desktop, 1 for mobile)
  const getVisibleSlides = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const visibleCount = isMobile ? 1 : 3;
    const result = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % slides.length;
      result.push(slides[index]);
    }

    return result;
  };

  const visibleSlides = getVisibleSlides();

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Informasi Penting
          </h2>
          <div className="w-20 h-1 bg-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kumpulan informasi penting dan terbaru dari Pengadilan Negeri Nanga Bulik
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Slides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {visibleSlides.map((slide) => (
              <div
                key={slide.id}
                className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-80 flex flex-col bg-white border border-gray-200"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Error';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-900 transition-colors">
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p className="text-sm text-gray-600 line-clamp-3 group-hover:text-gray-700">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={goToPrevious}
              className="p-3 rounded-full bg-white border border-gray-300 hover:bg-red-900 hover:text-white hover:border-red-900 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Indicators */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-red-900 w-8'
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-white border border-gray-300 hover:bg-red-900 hover:text-white hover:border-red-900 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-6 text-sm text-gray-500">
            {currentIndex + 1} / {slides.length}
          </div>
        </div>
      </div>
    </section>
  );
}
