'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-red-700"
    >
      {/* Background Image with Low Opacity */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-800/70 to-transparent"></div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            Resmi & Terpercaya
          </span>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Melayani Dengan Integritas dan Profesionalisme
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-red-50 mb-8 leading-relaxed">
            Pengadilan Negeri Nanga Bulik berkomitmen memberikan pelayanan hukum
            yang transparan, akuntabel, dan mudah diakses oleh seluruh masyarakat
            Indonesia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-white text-red-900 hover:bg-red-50 rounded-lg px-8 py-6 text-base font-semibold h-auto"
            >
              Daftarkan Perkara
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 rounded-lg px-8 py-6 text-base font-semibold h-auto bg-transparent"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Cek Jadwal Sidang
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
