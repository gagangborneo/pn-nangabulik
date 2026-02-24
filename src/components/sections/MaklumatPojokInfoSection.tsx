'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface PortraitSlide {
  id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface SliderProps {
  title: string;
  slides: PortraitSlide[];
  emptyLabel: string;
}

function PortraitSlider({ title, slides, emptyLabel }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  const goToPrevious = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-6 pt-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="w-16 h-1 bg-[#8B0000] mt-2"></div>
      </div>

      <div className="p-6">
        {slides.length === 0 ? (
          <div className="aspect-[3/4] rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
            <ImageIcon className="h-8 w-8 mb-2" />
            <p className="text-sm">{emptyLabel}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={slides[currentIndex]?.imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Image+Error';
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevious}
                className="p-2 rounded-full border border-gray-200 hover:bg-[#8B0000] hover:text-white transition-all"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-[#8B0000] w-8'
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goToNext}
                className="p-2 rounded-full border border-gray-200 hover:bg-[#8B0000] hover:text-white transition-all"
                aria-label="Berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">
              {currentIndex + 1} / {slides.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MaklumatPojokInfoSection() {
  const [maklumatSlides, setMaklumatSlides] = useState<PortraitSlide[]>([]);
  const [pojokInfoSlides, setPojokInfoSlides] = useState<PortraitSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const [maklumatResponse, pojokResponse] = await Promise.all([
          fetch('/api/maklumat-slides'),
          fetch('/api/pojok-info-slides'),
        ]);

        const [maklumatData, pojokData] = await Promise.all([
          maklumatResponse.json(),
          pojokResponse.json(),
        ]);

        const activeMaklumat = (maklumatData.slides || []).filter((slide: PortraitSlide) => slide.isActive);
        const activePojok = (pojokData.slides || []).filter((slide: PortraitSlide) => slide.isActive);

        setMaklumatSlides(activeMaklumat);
        setPojokInfoSlides(activePojok);
      } catch (error) {
        console.error('Error fetching portrait sliders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return null;
  }

  // Show section even if one slider is empty
  if (maklumatSlides.length === 0 && pojokInfoSlides.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortraitSlider
            title="Maklumat"
            slides={maklumatSlides}
            emptyLabel="Belum ada gambar maklumat"
          />
          <PortraitSlider
            title="Pojok Info"
            slides={pojokInfoSlides}
            emptyLabel="Belum ada gambar pojok info"
          />
        </div>
      </div>
    </section>
  );
}
