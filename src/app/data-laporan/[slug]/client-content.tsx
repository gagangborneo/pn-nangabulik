'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Eye, CalendarDays, User, FolderOpen } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ReportCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
}

interface ReportLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  createdAt: string;
  reportDate?: string | null;
  _count?: {
    views: number;
  };
}

interface CategoryStats {
  totalViews: number;
  uniqueVisitors: number;
}

interface DataLaporanClientProps {
  category: ReportCategory | null;
  links: ReportLink[];
  stats: CategoryStats;
}

export default function DataLaporanClient({ category, links, stats }: DataLaporanClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Kategori Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-4">Kategori yang Anda cari tidak tersedia</p>
          <Link
            href="/data-laporan"
            className="inline-flex items-center gap-2 text-red-800 hover:text-red-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Data Laporan
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-10">
          <div className="container mx-auto px-4">
            <Link
              href="/data-laporan"
              className="inline-flex items-center gap-2 text-red-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Data Laporan
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                {/* Icon placeholder */}
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{category.title}</h1>
                {category.description && (
                  <p className="text-red-100 mt-2">{category.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Akses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString('id-ID')}</p>
                  </div>
                  <Eye className="h-8 w-8 text-red-900/30" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pengunjung Unik</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.uniqueVisitors.toLocaleString('id-ID')}</p>
                  </div>
                  <User className="h-8 w-8 text-red-900/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
            />
          </div>

          {/* Links List */}
          {filteredLinks.length > 0 ? (
            <div className="grid gap-4">
              {filteredLinks.map((link) => (
                <div key={link.id} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                      {link.description && (
                        <p className="text-gray-600 text-sm mb-3">{link.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {link.reportDate && (
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(link.reportDate).toLocaleDateString('id-ID')}
                          </div>
                        )}
                        {link._count && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {link._count.views} kali diakses
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors flex-shrink-0"
                    >
                      <span>Buka</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada dokumen yang ditemukan</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
