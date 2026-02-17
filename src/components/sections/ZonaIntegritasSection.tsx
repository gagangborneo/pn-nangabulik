'use client';

export default function ZonaIntegritasSection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Banner Zona Integritas */}
        <div className="relative bg-gradient-to-r from-[#8B0000] via-[#A50000] to-[#B22222] rounded-xl overflow-hidden shadow-xl">
          {/* Diagonal decorative shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-10 w-40 h-80 bg-white/10 transform rotate-12"></div>
            <div className="absolute -top-10 left-20 w-32 h-96 bg-orange-400/10 transform rotate-12"></div>
            <div className="absolute top-0 right-40 w-24 h-80 bg-white/5 transform -rotate-12"></div>
            <div className="absolute -bottom-20 -right-10 w-40 h-80 bg-orange-400/10 transform -rotate-12"></div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between py-8 px-6 md:px-12 gap-6 md:gap-8">
            {/* Logo Pengadilan Negeri Nanga Bulik - Left */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 relative">
                <img
                  src="https://web.pn-nangabulik.go.id/wp-content/uploads/2020/01/cropped-logopnnangabuliktanpalatar-1.png"
                  alt="Logo Pengadilan Negeri Nanga Bulik"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>

            {/* Text Content - Center */}
            <div className="flex-1 text-center">
              {/* Welcome Header */}
              <p className="text-yellow-400 text-lg md:text-xl font-bold mb-1 tracking-wide">
                Selamat Datang
              </p>
              <p className="text-white text-base md:text-lg font-medium mb-4">
                Di Pengadilan Negeri Nanga Bulik
              </p>

              {/* Main Message */}
              <div className="space-y-1">
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold tracking-wide drop-shadow-md">
                  ANDA MEMASUKI ZONA INTEGRITAS
                </p>
                <p className="text-white text-base md:text-lg font-bold mt-2">
                  WILAYAH BEBAS DARI KORUPSI (WBK)
                </p>
                <p className="text-yellow-400 text-base md:text-lg font-bold">
                  DAN
                </p>
                <p className="text-white text-base md:text-lg font-bold">
                  WILAYAH BIROKRASI BERSIH DAN MELAYANI (WBBM)
                </p>
              </div>
            </div>

            {/* Zona Integritas Badge - Right */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-red-700">
                <div className="text-center p-1">
                  <p className="text-red-700 text-[8px] md:text-[10px] font-bold leading-tight">ZONA</p>
                  <p className="text-red-700 text-[8px] md:text-[10px] font-bold leading-tight">INTEGRITAS</p>
                  <div className="relative mt-1">
                    <p className="text-red-600 text-[6px] font-bold">KORUPSI</p>
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-red-600 transform -translate-y-1/2"></div>
                  </div>
                  <div className="flex justify-center mt-1">
                    <div className="text-red-600 text-[6px]">
                      🚫
                    </div>
                  </div>
                  <p className="text-red-600 text-[5px] md:text-[6px] font-bold mt-0.5">GRATIFIKASI</p>
                  <p className="text-red-600 text-[5px] md:text-[6px] font-bold">NO PUNGUT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
