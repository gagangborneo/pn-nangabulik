'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  order: number;
}

const defaultPartners: Partner[] = [
  {
    id: '1',
    name: 'Mahkamah Agung RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'https://www.mahkamahagung.go.id',
    order: 0,
  },
  {
    id: '2',
    name: 'Kepaniteraan MA RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'https://kepaniteraan.mahkamahagung.go.id/',
    order: 1,
  },
  {
    id: '3',
    name: 'Badan Peradilan Umum MA RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'http://badilum.mahkamahagung.go.id/',
    order: 2,
  },
  {
    id: '4',
    name: 'Badan Urusan Administrasi MA RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'http://bua.mahkamahagung.go.id/',
    order: 2,
  },
  {
    id: '5',
    name: 'Badan Pengadilan Tinggi Palangkaraya',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'http://pt-palangkaraya.go.id/',
    order: 2,
  },
  {
    id: '6',
    name: 'Pemerintah Kabupaten Lamandau',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/LOGO-KABUPATEN-LAMANDAU-1.png',
    websiteUrl: 'https://lamandaukab.go.id',
    order: 3,
  },
];

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>(defaultPartners);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = carouselRef.current;
    if (!container) {
      return;
    }

    const scrollAmount = container.clientWidth;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const isAtStart = container.scrollLeft <= 0;
    const isAtEnd = container.scrollLeft >= maxScrollLeft - 1;

    if (direction === 'left' && isAtStart) {
      container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
      return;
    }

    if (direction === 'right' && isAtEnd) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        const data = await response.json();
        if (data.partners && data.partners.length > 0) {
          setPartners(data.partners);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-[#8B0000] via-[#a00000] to-[#6b0000]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Lembaga & Institusi Terkait
          </h2>
          <div className="w-20 h-1 bg-white/60 mx-auto"></div>
        </div>

        {/* Partners Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div className="flex absolute -left-6 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="h-10 w-10 rounded-full bg-white/90 text-[#8B0000] shadow-md hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8B0000]"
              aria-label="Scroll partners left"
            >
              <ChevronLeft className="h-5 w-5 mx-auto" />
            </button>
          </div>
          <div className="flex absolute -right-6 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="h-10 w-10 rounded-full bg-white/90 text-[#8B0000] shadow-md hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8B0000]"
              aria-label="Scroll partners right"
            >
              <ChevronRight className="h-5 w-5 mx-auto" />
            </button>
          </div>
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="snap-start shrink-0 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <a
                  href={partner.websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/95 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 flex items-center justify-center group backdrop-blur-sm h-full"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <h3 className="text-xs text-gray-600 font-medium text-center line-clamp-2 group-hover:text-[#8B0000] transition-colors">
                      {partner.name}
                    </h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
