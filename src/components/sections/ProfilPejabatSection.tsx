'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Pejabat {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function ProfilPejabatSection() {
  const [pejabat, setPejabat] = useState<Pejabat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPejabat = async () => {
      try {
        const response = await fetch('/api/pejabat');
        const data = await response.json();
        if (data.pejabat && data.pejabat.length > 0) {
          setPejabat(data.pejabat);
        }
      } catch (error) {
        console.error('Error fetching pejabat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPejabat();
  }, []);

  // Calculate visible items (2 at a time)
  const itemsPerSlide = 2;
  const totalSlides = Math.ceil(pejabat.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get current visible items
  const getVisibleItems = (): Pejabat[] => {
    const startIndex = currentIndex * itemsPerSlide;
    const items: Pejabat[] = [];
    for (let i = 0; i < itemsPerSlide; i++) {
      const index = startIndex + i;
      if (index < pejabat.length) {
        items.push(pejabat[index]);
      }
    }
    return items;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Profil Pejabat Pengadilan Negeri Nanga Bulik
          </h2>
          <div className="w-20 h-1 bg-[#8B0000] mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Para pejabat yang bertanggung jawab dalam penyelenggaraan peradilan di Pengadilan Negeri Nanga Bulik
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B0000] border-t-transparent" />
          </div>
        )}

        {/* Empty State */}
        {!loading && pejabat.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada data pejabat</p>
          </div>
        )}

        {/* Content - Only show if not loading and has data */}
        {!loading && pejabat.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden px-2">
            <div
              className="grid grid-cols-2 gap-4 md:gap-6 transition-transform duration-500 my-6"
            >
              {getVisibleItems().map((person, index) => (
                <div
                  key={person.id || index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Profile Image */}
                  <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 md:p-8">
                    {person.imageUrl ? (
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-3xl md:text-4xl font-bold text-white">
                          {person.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 md:p-6 text-center">
                    <h3 className="font-bold text-base md:text-lg text-gray-800 mb-2 line-clamp-2">
                      {person.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{person.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-red-900 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
