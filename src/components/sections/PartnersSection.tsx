'use client';

import { useEffect, useState } from 'react';

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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lambang_Mahkamah_Agung.svg/200px-Lambang_Mahkamah_Agung.svg.png',
    websiteUrl: 'https://www.mahkamahagung.go.id',
    order: 0,
  },
  {
    id: '2',
    name: 'Pengadilan Tinggi Palangkaraya',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lambang_Mahkamah_Agung.svg/200px-Lambang_Mahkamah_Agung.svg.png',
    websiteUrl: 'https://pt-palangkaraya.go.id',
    order: 1,
  },
  {
    id: '3',
    name: 'Kementerian Hukum dan HAM',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lambang_Mahkamah_Agung.svg/200px-Lambang_Mahkamah_Agung.svg.png',
    websiteUrl: 'https://kemhan.go.id',
    order: 2,
  },
  {
    id: '4',
    name: 'Pemerintah Kabupaten Lamandau',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lambang_Mahkamah_Agung.svg/200px-Lambang_Mahkamah_Agung.svg.png',
    websiteUrl: 'https://lamandaukab.go.id',
    order: 3,
  },
];

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>(defaultPartners);

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

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.websiteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 flex items-center justify-center group backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="text-xs text-gray-600 font-medium text-center line-clamp-2 group-hover:text-[#8B0000] transition-colors">
                  {partner.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
