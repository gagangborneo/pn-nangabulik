'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';
import { Loader2 } from 'lucide-react';

interface PageData {
  id: string;
  url: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  wordpressSlug: string;
  isActive: boolean;
}

interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
}

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string[];
  const [page, setPage] = useState<PageData | null>(null);
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Construct URL from slug array
  const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        
        // Fetch page data by URL
        const pageResponse = await fetch(`/api/pages?url=${encodeURIComponent(url)}`);
        
        if (!pageResponse.ok) {
          setError(true);
          return;
        }

        const pageData = await pageResponse.json();
        
        if (!pageData || !pageData.isActive) {
          setError(true);
          return;
        }

        setPage(pageData);

        // Fetch WordPress content
        const wpResponse = await fetch(
          `https://web.pn-nangabulik.go.id/wp-json/wp/v2/posts?slug=${pageData.wordpressSlug}&_embed`
        );

        if (wpResponse.ok) {
          const wpData = await wpResponse.json();
          if (wpData && wpData.length > 0) {
            setPost(wpData[0]);
          }
        }
      } catch (err) {
        console.error('Error loading page:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [url]);

  useEffect(() => {
    if (page) {
      // Update page title
      document.title = page.seoTitle || page.title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && page.seoDescription) {
        metaDescription.setAttribute('content', page.seoDescription);
      } else if (!metaDescription && page.seoDescription) {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = page.seoDescription;
        document.head.appendChild(meta);
      }
    }
  }, [page]);

  if (error) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
            <p className="text-gray-500">Memuat halaman...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <AutoTTSWrapper>
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-8">
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <a href="/" className="hover:text-[#8B0000] transition-colors">
                    Home
                  </a>
                </li>
                {slug.map((segment, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-gray-400">/</span>
                    <span className={`capitalize ${index === slug.length - 1 ? 'text-[#8B0000] font-semibold' : 'text-gray-600'}`}>
                      {segment.replace(/-/g, ' ')}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Page Title Card */}
            <div className="bg-linear-to-r from-[#8B0000] via-[#A50000] to-[#6B0000] rounded-2xl shadow-lg mb-12 overflow-hidden">
              <div className="px-6 py-10 md:px-10 md:py-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {page?.title}
                </h1>
                {page?.seoDescription && (
                  <p className="text-red-100 mt-3 text-base md:text-lg leading-relaxed">
                    {page.seoDescription}
                  </p>
                )}
              </div>
            </div>

            {/* WordPress Content */}
            {post ? (
              <article className="bg-white rounded-xl shadow-md p-6 md:p-10 mb-8">
                <div
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  className="wordpress-content"
                />
              </article>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-1">Konten tidak ditemukan</p>
                <p className="text-gray-400 text-sm">Pastikan slug WordPress sudah benar atau hubungi administrator</p>
              </div>
            )}
          </div>
        </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
  );
}
