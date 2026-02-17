'use client';

import { Scale, Shield, FileCheck, Users } from 'lucide-react';

export default function WadahKeadilanSection() {
  const features = [
    {
      icon: Scale,
      title: 'Keadilan untuk Semua',
      description: 'Memberikan akses keadilan yang merata bagi seluruh masyarakat tanpa diskriminasi.',
    },
    {
      icon: Shield,
      title: 'Perlindungan Hukum',
      description: 'Menjamin perlindungan hak-hak hukum setiap warga negara di pengadilan.',
    },
    {
      icon: FileCheck,
      title: 'Proses Hukum yang Jujur',
      description: 'Memastikan proses hukum yang transparan, jujur, dan dapat dipertanggungjawabkan.',
    },
    {
      icon: Users,
      title: 'Pelayanan Prima',
      description: 'Memberikan pelayanan terbaik dengan profesionalisme dan integritas tinggi.',
    },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-red-900/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-red-900/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Wadah Keadilan untuk Seluruh Masyarakat
            </h2>
            <div className="w-20 h-1 bg-red-900 mb-6"></div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Pengadilan Negeri Nanga Bulik hadir sebagai wadah keadilan yang
              terbuka untuk seluruh lapisan masyarakat. Kami berkomitmen untuk
              memberikan pelayanan hukum yang berkualitas dengan mengutamakan
              prinsip keadilan, kepastian, dan kemanfaatan.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="flex-1 relative">
            <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-700 rounded-2xl p-8 relative overflow-hidden shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full"></div>

              <div className="relative z-10 text-center py-8">
                <Scale className="h-20 w-20 text-white/80 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Keadilan & Kebenaran
                </h3>
                <p className="text-white/80">
                  Dalam Naungan Hukum Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
