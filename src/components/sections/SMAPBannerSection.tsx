'use client';

import { ShieldAlert } from 'lucide-react';

export default function SMAPBannerSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#8B0000] to-[#A50000] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left - Person Illustration */}
          <div className="hidden lg:block relative">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
              <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">
                <ShieldAlert className="h-20 w-20 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-red-900 font-bold px-4 py-1 rounded-full text-sm">
              STOP GRATIFIKASI
            </div>
          </div>

          {/* Center - Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              DUKUNG KAMI DALAM MENGERAPKAN
            </h2>
            <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6">
              Sistem Management Anti Penyuapan (SMAP)
            </h3>
            <p className="text-white/80 max-w-xl mx-auto lg:mx-0">
              Pengadilan Negeri Nanga Bulik berkomitmen untuk mewujudkan pelayanan
              publik yang bersih dari praktik penyuapan dan gratifikasi.
            </p>
          </div>

          {/* Right - Building Illustration */}
          <div className="hidden lg:block">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
              <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="h-16 w-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Logos */}
        <div className="flex justify-center items-center gap-8 mt-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
            <span className="font-bold text-white">BerAKHLAK</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
            <span className="font-bold text-white">bangsa melayani bangsa</span>
          </div>
        </div>
      </div>
    </section>
  );
}
