'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, FileText, ArrowRight } from 'lucide-react';

interface PengumumanSidang {
  id: string;
  title: string;
  url: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function PengumumanSidangSection() {
  const [items, setItems] = useState<PengumumanSidang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/pengumuman-sidang?limit=4');
      const data = await response.json();
      setItems((data.items || []).slice(0, 4));
    } catch (error) {
      console.error('Error fetching pengumuman sidang:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || items.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className="py-8 bg-linear-to-r rounded-2xl from-red-900 to-red-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-yellow-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Pengumuman & Pemanggilan Sidang
            </h2>
          </div>
        </div>

        {/* Grid Items */}
        <div className="grid grid-cols-1 max-w-4xl mx-auto gap-4 mb-8">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/95 backdrop-blur border border-red-200 rounded-xl p-4 hover:shadow-lg hover:border-yellow-400 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100 group-hover:bg-yellow-50 transition-colors">
                    <FileText className="h-6 w-6 text-red-900" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-900 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/pengumuman-sidang"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-900 hover:bg-red-800 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Lihat Semua Pengumuman
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
