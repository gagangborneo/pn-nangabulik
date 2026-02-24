'use client';

import { Calendar } from 'lucide-react';

export default function JadwalSidangSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-red-900" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Jadwal Sidang
            </h2>
          </div>
          <div className="w-20 h-1 bg-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Jadwal sidang disusun dan diumumkan secara terbuka untuk memastikan transparansi proses peradilan
          </p>
        </div>

        {/* iframe Container */}
        <div className="max-w-6xl mx-auto bg-gray-50 rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            src="https://sipp.pn-nangabulik.go.id/list_jadwal_sidang"
            title="Jadwal Sidang"
            className="w-full h-screen md:h-[600px]"
            frameBorder="0"
            allowFullScreen
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
