'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  PieChart,
  FolderOpen,
  Loader2,
  ArrowRight
} from 'lucide-react';

// Layout
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MaintenanceCheck } from '@/components/MaintenanceCheck';

// TTS
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';

interface ReportCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  order: number;
  isActive: boolean;
  _count?: {
    links: number;
    views: number;
  };
}

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  FileText,
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  PieChart,
  FolderOpen,
};

export default function DataLaporanPage() {
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/reports/categories');
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FileText;
    return <IconComponent className="h-10 w-10 text-teal-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <MaintenanceCheck />
      <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <AutoTTSWrapper>
        <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Data Laporan
            </h1>
            <p className="text-center text-red-200 text-lg">
              Akses dokumen dan laporan resmi Pengadilan Negeri Nanga Bulik
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 bg-gray-50">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada kategori laporan tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-teal-50 rounded-full">
                        {getIcon(category.icon)}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                      {category.description || 'Tidak ada deskripsi'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                      <span>{category._count?.links || 0} dokumen</span>
                      <span>•</span>
                      <span>{category._count?.views || 0} dilihat</span>
                    </div>

                    {/* Button */}
                    <Link
                      href={`/data-laporan/${category.slug}`}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition-colors"
                    >
                      Akses Menu
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
    </>
