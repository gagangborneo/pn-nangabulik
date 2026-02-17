'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  date: string;
  featuredImage: {
    url: string;
    alt: string;
    sizes: Record<string, { source_url: string }>;
  } | null;
  author: {
    name: string;
    avatar: string | null;
  } | null;
  categories: Array<{ id: number; name: string; slug: string }>;
}

interface SinglePostViewProps {
  slug: string;
  onClose: () => void;
}

export default function SinglePostView({ slug, onClose }: SinglePostViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevPost, setPrevPost] = useState<Post | null>(null);
  const [nextPost, setNextPost] = useState<Post | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current post
        const response = await fetch(`/api/posts?slug=${slug}`);
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          const currentPost = data.posts[0];
          setPost(currentPost);

          // Fetch all posts to find prev/next
          const allPostsResponse = await fetch('/api/posts?per_page=100');
          const allPostsData = await allPostsResponse.json();
          
          if (allPostsData.posts) {
            const currentIndex = allPostsData.posts.findIndex(
              (p: Post) => p.id === currentPost.id
            );
            
            if (currentIndex > 0) {
              setNextPost(allPostsData.posts[currentIndex - 1]);
            }
            if (currentIndex < allPostsData.posts.length - 1) {
              setPrevPost(allPostsData.posts[currentIndex + 1]);
            }
          }

          // Fetch latest 3 posts (excluding current)
          const latestResponse = await fetch('/api/posts?per_page=4');
          const latestData = await latestResponse.json();
          
          if (latestData.posts) {
            const filteredLatest = latestData.posts
              .filter((p: Post) => p.id !== currentPost.id)
              .slice(0, 3);
            setLatestPosts(filteredLatest);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getImageUrl = (post: Post) => {
    if (!post.featuredImage) {
      return 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    }
    return (
      post.featuredImage.sizes?.large?.source_url ||
      post.featuredImage.sizes?.full?.source_url ||
      post.featuredImage.url
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Artikel Tidak Ditemukan
            </h2>
            <Button onClick={onClose} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.date)}</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          )}
          {post.categories.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{post.categories[0].name}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={getImageUrl(post)}
            alt={post.title}
            className="w-full max-h-125 object-cover rounded-xl"
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Navigation: Previous & Next Posts */}
        <div className="border-t border-b border-gray-200 py-6 my-12">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Previous Post */}
            <div className="flex-1">
              {prevPost ? (
                <Link href={`/berita/${prevPost.slug}`} className="group block">
                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-[#8B0000] mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Berita Sebelumnya</p>
                      <h3 
                        className="text-sm font-semibold text-gray-800 group-hover:text-[#8B0000] line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: prevPost.title }}
                      />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="p-4 text-gray-400 text-sm">Tidak ada berita sebelumnya</div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200"></div>

            {/* Next Post */}
            <div className="flex-1">
              {nextPost ? (
                <Link href={`/berita/${nextPost.slug}`} className="group block">
                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-500 mb-1">Berita Selanjutnya</p>
                      <h3 
                        className="text-sm font-semibold text-gray-800 group-hover:text-[#8B0000] line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: nextPost.title }}
                      />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#8B0000] mt-1 shrink-0" />
                  </div>
                </Link>
              ) : (
                <div className="p-4 text-gray-400 text-sm text-right">Tidak ada berita selanjutnya</div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Posts Section */}
        {latestPosts.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Berita Terbaru Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((latestPost) => (
                <Link key={latestPost.id} href={`/berita/${latestPost.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={getImageUrl(latestPost)}
                          alt={latestPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(latestPost.date)}</span>
                      </div>
                      <CardTitle className="text-base font-semibold text-gray-800 group-hover:text-[#8B0000] line-clamp-2 mb-2">
                        <span dangerouslySetInnerHTML={{ __html: latestPost.title }} />
                      </CardTitle>
                      {latestPost.excerpt && (
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          <span dangerouslySetInnerHTML={{ __html: latestPost.excerpt }} />
                        </CardDescription>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <style jsx global>{`
        .article-content {
          color: #374151;
          line-height: 1.8;
        }
        .article-content p {
          margin-bottom: 1rem;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem auto;
          display: block;
        }
        .article-content h2,
        .article-content h3,
        .article-content h4 {
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .article-content ul,
        .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content a {
          color: #8B0000;
          text-decoration: underline;
        }
        .article-content blockquote {
          border-left: 4px solid #8B0000;
          padding-left: 1rem;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
