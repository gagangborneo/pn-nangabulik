import DataLaporanClient from './client-content';
import { shouldRedirectToMaintenance } from '@/lib/maintenance';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Check maintenance mode
  const shouldRedirect = await shouldRedirectToMaintenance();
  if (shouldRedirect) {
    redirect('/maintenance');
  }

  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // Fetch category by slug
    const catResponse = await fetch(`${baseUrl}/api/reports/categories`, {
      next: { revalidate: 60 },
    });
    const catData = await catResponse.json();
    const foundCategory = catData.categories?.find((c: ReportCategory) => c.slug === slug);

    // Fetch links for this category
    let links: ReportLink[] = [];
    let stats: CategoryStats = { totalViews: 0, uniqueVisitors: 0 };

    if (foundCategory) {
      const linksResponse = await fetch(`${baseUrl}/api/reports/links?categoryId=${foundCategory.id}`, {
        next: { revalidate: 60 },
      });
      const linksData = await linksResponse.json();
      links = linksData.links || [];

      // Fetch stats
      const statsResponse = await fetch(`${baseUrl}/api/reports/track?categoryId=${foundCategory.id}`, {
        next: { revalidate: 60 },
      });
      const statsData = await statsResponse.json();
      stats = {
        totalViews: statsData.totalViews || 0,
        uniqueVisitors: statsData.uniqueVisitors || 0,
      };
    }

    return (
      <DataLaporanClient
        category={foundCategory || null}
        links={links}
        stats={stats}
      />
    );
  } catch (error) {
    console.error('Error loading category:', error);
    
    // Return error state with null category
    return (
      <DataLaporanClient
        category={null}
        links={[]}
        stats={{ totalViews: 0, uniqueVisitors: 0 }}
      />
    );
  }
}
