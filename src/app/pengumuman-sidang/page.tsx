'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PengumumanSidang {
  id: string;
  title: string;
  url: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

interface PaginationData {
  items: PengumumanSidang[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function PengumumanSidangPage() {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  const fetchItems = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pengumuman-sidang?page=${pageNum}&limit=10`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching pengumuman sidang:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 animate-spin mb-4">
                <div className="h-6 w-6 rounded-full border-2 border-red-900 border-t-transparent"></div>
              </div>
              <p className="text-gray-600">Memuat data...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-red-900 hover:text-red-800 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-red-900" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Pengumuman & Pemanggilan Sidang
              </h1>
            </div>
            <div className="w-20 h-1 bg-red-900 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Daftar lengkap pengumuman dan pemanggilan sidang dari Pengadilan Negeri Nanga Bulik
            </p>
          </div>

          {/* Items List */}
          {!data || data.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Belum ada data pengumuman sidang</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {data.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-red-900 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                          <FileText className="h-6 w-6 text-red-900" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-900 transition-colors">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-gray-600 mt-1 text-sm">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-800 text-white font-medium text-sm rounded-lg transition-colors"
                          >
                            Buka
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={data.pagination.page === 1}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors ${
                            pageNum === data.pagination.page
                              ? 'bg-red-900 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={data.pagination.page === data.pagination.totalPages}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Berikutnya
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Info */}
              <div className="text-center mt-8 text-sm text-gray-600">
                Menampilkan{' '}
                <span className="font-semibold">
                  {(data.pagination.page - 1) * data.pagination.limit + 1}-
                  {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}
                </span>{' '}
                dari <span className="font-semibold">{data.pagination.total}</span> pengumuman
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
