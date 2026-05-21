'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PortraitSlide {
  id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

function MaklumatCard({ slide }: { slide: PortraitSlide }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={slide.imageUrl}
            alt="Maklumat"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Image+Error';
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MaklumatPojokInfoSection() {
  const [maklumatSlides, setMaklumatSlides] = useState<PortraitSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/maklumat-slides');
        const data = await response.json();
        const activeMaklumat = (data.slides || []).filter((slide: PortraitSlide) => slide.isActive);
        setMaklumatSlides(activeMaklumat);
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

  if (maklumatSlides.length === 0) {
    return null;
  }

  const displayedSlides = maklumatSlides.slice(0, 2);

  return (
    <section className="">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayedSlides.length === 0 ? (
          <div className="border border-gray-100 overflow-hidden">
            <div className="">
              <div className="aspect-3/4 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                <ImageIcon className="h-8 w-8 mb-2" />
                <p className="text-sm">Belum ada gambar maklumat</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedSlides.map((slide) => (
              <MaklumatCard key={slide.id} slide={slide} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
