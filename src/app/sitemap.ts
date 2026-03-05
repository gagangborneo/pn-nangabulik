import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { getWordPressUrl } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pn-nangabulik.go.id';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pengumuman-sidang`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/data-laporan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic pages from database (CMS pages)
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const pages = await db.page.findMany({
      where: { isActive: true },
      select: { url: true, updatedAt: true },
    });

    dynamicPages = pages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching pages for sitemap:', error);
  }

  // Report categories
  let reportPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await db.reportCategory.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    reportPages = categories.map((cat) => ({
      url: `${baseUrl}/data-laporan/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching report categories for sitemap:', error);
  }

  // WordPress blog posts
  let blogPostPages: MetadataRoute.Sitemap = [];
  try {
    const wpUrl = await getWordPressUrl();
    const response = await fetch(`${wpUrl}/posts?per_page=100&_fields=slug,modified`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const posts = await response.json();
      blogPostPages = posts.map((post: { slug: string; modified: string }) => ({
        url: `${baseUrl}/berita/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages, ...reportPages, ...blogPostPages];
}
