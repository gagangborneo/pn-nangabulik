'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Tag, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface RecentPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  featuredImage: {
    url: string;
    alt: string;
    sizes: Record<string, { source_url: string }>;
  } | null;
}

interface BlogSidebarProps {
  currentPostId?: number;
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export default function BlogSidebar({ 
  currentPostId, 
  selectedCategory,
  onCategorySelect 
}: BlogSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);

        // Fetch recent posts
        const postsResponse = await fetch('/api/posts?per_page=5');
        const postsData = await postsResponse.json();
        
        // Filter out current post if viewing single post
        let posts = postsData.posts || [];
        if (currentPostId) {
          posts = posts.filter((post: RecentPost) => post.id !== currentPostId);
        }
        
        setRecentPosts(posts.slice(0, 5));
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, [currentPostId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getImageUrl = (post: RecentPost) => {
    if (!post.featuredImage) {
      return null;
    }
    return (
      post.featuredImage.sizes?.thumbnail?.source_url ||
      post.featuredImage.sizes?.medium?.source_url ||
      post.featuredImage.url
    );
  };

  if (loading) {
    return (
      <aside className="space-y-6">
        {/* Categories Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    );
  }

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-red-900 to-red-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5" />
            Kategori
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id}>
                {onCategorySelect ? (
                  <button
                    onClick={() => onCategorySelect(category.id.toString())}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id.toString()
                        ? 'bg-red-50 text-red-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      {category.name}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={`/berita?category=${category.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      {category.name}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-red-900 to-red-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Berita Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/berita/${post.slug}`}
                className="group flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
              >
                {getImageUrl(post) && (
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(post)!}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 
                    className="text-sm font-medium text-gray-800 group-hover:text-red-900 line-clamp-2 mb-1 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Archive by Year */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-red-900 to-red-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Arsip
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-1">
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <Link
                  key={year}
                  href={`/berita?year=${year}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    Tahun {year}
                  </span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
