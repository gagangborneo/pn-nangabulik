'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  ArrowLeft,
  ExternalLink,
  Eye,
  CalendarDays,
  User
} from 'lucide-react';

// Layout
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
  _count?: {
    views: number;
  };
}

interface CategoryStats {
  totalViews: number;
  uniqueVisitors: number;
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

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [links, setLinks] = useState<ReportLink[]>([]);
  const [stats, setStats] = useState<CategoryStats>({ totalViews: 0, uniqueVisitors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch category by slug
        const catResponse = await fetch('/api/reports/categories');
        const catData = await catResponse.json();
        const foundCategory = catData.categories?.find((c: ReportCategory) => c.slug === slug);

        if (!foundCategory) {
          setLoading(false);
          return;
        }

        setCategory(foundCategory);

        // Fetch links for this category
        const linksResponse = await fetch(`/api/reports/links?categoryId=${foundCategory.id}`);
        const linksData = await linksResponse.json();
        setLinks(linksData.links || []);

        // Track view
        fetch('/api/reports/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: foundCategory.id }),
        });

        // Get stats
        const statsResponse = await fetch(`/api/reports/track?categoryId=${foundCategory.id}`);
        const statsData = await statsResponse.json();
        setStats({
          totalViews: statsData.totalViews || 0,
          uniqueVisitors: statsData.uniqueVisitors || 0,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track click
    try {
      await fetch('/api/reports/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      });
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FileText;
    return <IconComponent className="h-5 w-5" />;
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
                {getIcon(category.icon)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{category.title}</h1>
                {category.description && (
                  <p className="text-red-200 mt-1">{category.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Dipublikasikan oleh Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <span>{stats.totalViews.toLocaleString()} dilihat</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{stats.uniqueVisitors} pengunjung unik</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 bg-gray-50">
          {links.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada dokumen dalam kategori ini</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {links.map((link, index) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="block bg-white rounded-lg border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-red-50 rounded-lg">
                      <FileText className="h-5 w-5 text-red-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1">{link.title}</h3>
                      {link.description && (
                        <p className="text-sm text-gray-500 mb-2">{link.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(link.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {link._count?.views || 0} dilihat
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
