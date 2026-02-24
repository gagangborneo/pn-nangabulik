import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';
import { MaintenanceCheck } from '@/components/MaintenanceCheck';
import { shouldRedirectToMaintenance } from '@/lib/maintenance';
import { redirect } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds

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

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  // Check maintenance mode
  const shouldRedirect = await shouldRedirectToMaintenance();
  if (shouldRedirect) {
    redirect('/maintenance');
  }

  const { slug } = await params;
  const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug);

  try {
    // Fetch page data by URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const pageResponse = await fetch(`${baseUrl}/api/pages?url=${encodeURIComponent(url)}`, {
      next: { revalidate: 60 },
    });
    
    if (!pageResponse.ok) {
      notFound();
    }

    const page: PageData = await pageResponse.json();
    
    if (!page || !page.isActive) {
      notFound();
    }

    // Fetch WordPress content
    let post: WordPressPost | null = null;
    try {
      const wpResponse = await fetch(
        `https://web.pn-nangabulik.go.id/wp-json/wp/v2/posts?slug=${page.wordpressSlug}&_embed`,
        { next: { revalidate: 60 } }
      );

      if (wpResponse.ok) {
        const wpData = await wpResponse.json();
        if (wpData && wpData.length > 0) {
          post = wpData[0];
        }
      }
    } catch (err) {
      console.error('Error fetching WordPress content:', err);
    }

    return (
      <>
        <MaintenanceCheck />
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <AutoTTSWrapper>
            <main className="flex-1 py-8 md:py-12">
              <div className="container mx-auto px-4 max-w-6xl">
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
                <div className="bg-gradient-to-r from-[#8B0000] via-[#A50000] to-[#6B0000] rounded-2xl shadow-lg mb-12 overflow-hidden">
                  <div className="px-6 py-10 md:px-10 md:py-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {page.title}
                    </h1>
                    {page.seoDescription && (
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
      </>
    );
  } catch (err) {
    console.error('Error loading page:', err);
    notFound();
  }
}
