'use client';

import Image from 'next/image';

export default function LogoBannerSection() {
  return (
    <section className="bg-white border-b-4 border-red-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 md:gap-12">
          {/* Left Logo - BerAKHLAK */}
          <div className="flex-1 flex justify-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src="https://djpb.kemenkeu.go.id/kppn/barabai/images/Logo_BerAKHLAK.png"
                alt="BerAKHLAK - Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif"
                className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
              />
            </div>
          </div>

          {/* Center Divider */}
          <div className="hidden md:block w-px h-24 md:h-32 lg:h-40 bg-gradient-to-b from-transparent via-red-900/30 to-transparent"></div>

          {/* Right Logo - EVP */}
          <div className="flex-1 flex justify-end">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src="https://djpb.kemenkeu.go.id/kppn/barabai/images/Logo_EVP.png"
                alt="EVP - Excellence in Values and Performance"
                className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
