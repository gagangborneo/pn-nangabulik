'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts?slug=${slug}`);
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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
            className="w-full max-h-[500px] object-cover rounded-xl"
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
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
