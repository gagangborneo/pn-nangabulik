'use client';

import { ExternalLink, FileText, Calendar, BookOpen, ClipboardList, AlertCircle, Gavel, FolderSync } from 'lucide-react';

interface LayananItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  url: string;
  gradient: string;
  iconBg: string;
}

const layananData: LayananItem[] = [
  {
    id: '1',
    title: 'SIPP',
    description: 'Layanan digital untuk mengakses informasi perkara dengan mudah.',
    icon: FileText,
    url: 'https://sipp.pn-nangabulik.go.id/',
    gradient: 'from-blue-50 to-white',
    iconBg: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Jadwal Sidang',
    description: 'Jadwal sidang disusun dan diumumkan secara terbuka.',
    icon: Calendar,
    url: 'http://sipp.pn-nangabulik.go.id/list_jadwal_sidang/',
    gradient: 'from-green-50 to-white',
    iconBg: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Direktori Putusan',
    description: 'Akses publik terhadap salinan putusan pengadilan.',
    icon: BookOpen,
    url: 'https://putusan3.mahkamahagung.go.id/search.html?&court=29e34643d20beb9e89ceec68971fb933',
    gradient: 'from-purple-50 to-white',
    iconBg: 'bg-purple-500',
  },
  {
    id: '4',
    title: 'Survey Elektronik',
    description: 'Sarana penilaian kualitas layanan secara online.',
    icon: ClipboardList,
    url: 'http://esurvey.badilum.mahkamahagung.go.id/index.php/pengadilan/402028',
    gradient: 'from-yellow-50 to-white',
    iconBg: 'bg-yellow-500',
  },
  {
    id: '5',
    title: 'SIWAS',
    description: 'Sistem pelaporan pelanggaran di lingkungan pengadilan.',
    icon: AlertCircle,
    url: 'https://siwas.mahkamahagung.go.id/',
    gradient: 'from-red-50 to-white',
    iconBg: 'bg-red-500',
  },
  {
    id: '6',
    title: 'E-Court',
    description: 'Layanan pendaftaran, pembayaran, dan persidangan online.',
    icon: Gavel,
    url: 'https://ecourt.mahkamahagung.go.id/',
    gradient: 'from-indigo-50 to-white',
    iconBg: 'bg-indigo-500',
  },
  {
    id: '7',
    title: 'e-Berpadu',
    description: 'Integrasi berkas pidana antar penegak hukum.',
    icon: FolderSync,
    url: 'https://eberpadu.mahkamahagung.go.id/',
    gradient: 'from-teal-50 to-white',
    iconBg: 'bg-teal-500',
  },
];

export default function LayananPublikSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Curved Gradient Top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-900/5 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120V60C240 20 480 0 720 20C960 40 1200 80 1440 60V120H0Z"
            fill="url(#gradient1)"
          />
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="120">
              <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Layanan Publik Pengadilan
          </h2>
          <div className="w-20 h-1 bg-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Berbagai layanan digital untuk memudahkan akses informasi dan pelayanan pengadilan
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {layananData.map((service) => {
            const IconComponent = service.icon;

            return (
              <a
                key={service.id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-gradient-to-br ${service.gradient} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${service.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-900 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Link Indicator */}
                  <div className="flex items-center gap-1 text-xs text-red-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Akses Layanan</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Curved Gradient Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rotate-180">
          <path
            d="M0 80V40C240 10 480 0 720 10C960 20 1200 50 1440 40V80H0Z"
            fill="url(#gradient2)"
          />
          <defs>
            <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="80">
              <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
