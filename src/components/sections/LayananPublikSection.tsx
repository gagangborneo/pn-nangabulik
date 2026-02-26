'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, FileText, Calendar, BookOpen, ClipboardList, AlertCircle, Gavel, FolderSync } from 'lucide-react';

interface LayananItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string | null;
  order: number;
  isActive: boolean;
}

interface LayananItemWithUI extends LayananItem {
  gradient: string;
  iconBg: string;
  iconComponent: React.ElementType;
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Calendar,
  BookOpen,
  ClipboardList,
  AlertCircle,
  Gavel,
  FolderSync,
};

const gradients = [
  { gradient: 'from-blue-50 to-white', bg: 'bg-blue-500' },
  { gradient: 'from-green-50 to-white', bg: 'bg-green-500' },
  { gradient: 'from-purple-50 to-white', bg: 'bg-purple-500' },
  { gradient: 'from-yellow-50 to-white', bg: 'bg-yellow-500' },
  { gradient: 'from-red-50 to-white', bg: 'bg-red-500' },
  { gradient: 'from-indigo-50 to-white', bg: 'bg-indigo-500' },
  { gradient: 'from-teal-50 to-white', bg: 'bg-teal-500' },
];

export default function LayananPublikSection() {
  const [layananData, setLayananData] = useState<LayananItemWithUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const response = await fetch('/api/layanan');
        if (!response.ok) throw new Error('Failed to fetch layanan');

        const data = await response.json();
        const layananWithUI: LayananItemWithUI[] = data.layanan.map(
          (item: LayananItem, index: number) => {
            const gradientIndex = index % gradients.length;
            return {
              ...item,
              gradient: gradients[gradientIndex].gradient,
              iconBg: gradients[gradientIndex].bg,
              iconComponent: iconMap[item.icon] || FileText,
            };
          }
        );
        setLayananData(layananWithUI);
      } catch (error) {
        console.error('Error fetching layanan:', error);
        setLayananData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLayanan();
  }, []);
  return (
    <section className="py-16 bg-linear-to-r from-red-900 to-red-800 relative overflow-hidden">
       {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/3 rounded-full"></div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Layanan Publik Pengadilan
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-red-100 max-w-2xl mx-auto">
            Berbagai layanan digital untuk memudahkan akses informasi dan pelayanan pengadilan
          </p>
        </div>

        {/* Service Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="text-white">Loading...</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {layananData.map((service) => {
              const IconComponent = service.iconComponent;

              return (
                <a
                  key={service.id}
                  href={service.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-linear-to-br ${service.gradient} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:-translate-y-1`}
                >
                  <div className="flex flex-row sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-0">
                    {/* Icon */}
                    <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 ${service.iconBg} rounded-xl flex items-center justify-center sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>

                    <div className="flex-1 sm:flex-none">
                      {/* Title */}
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-900 transition-colors">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Link Indicator */}
                      <div className="flex items-center gap-1 text-xs text-red-900 font-medium opacity-50 group-hover:opacity-500 transition-opacity">
                        <span>Akses Layanan</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
