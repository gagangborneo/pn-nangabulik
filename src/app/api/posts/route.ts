import { NextRequest, NextResponse } from 'next/server';
import { getWordPressUrl } from '@/lib/wordpress';

/**
 * Decode HTML entities to natural text
 * Handles both numeric and named entities
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  
  // Map of common named HTML entities
  const namedEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&nbsp;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
    '&bull;': '•',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };

  let decoded = text;
  
  // First decode NUMERIC entities (both decimal and hexadecimal)
  // This must be done BEFORE named entities to avoid double-decoding
  
  // Decode hexadecimal entities (&#x1F44D;)
  decoded = decoded.replace(/&#x([a-f0-9]+);/gi, (_match, hex) => {
    try {
      const code = parseInt(hex, 16);
      return code > 0 ? String.fromCharCode(code) : '';
    } catch {
      return _match;
    }
  });

  // Decode decimal entities (&#038; or &#8217; etc)
  decoded = decoded.replace(/&#(\d+);/g, (_match, dec) => {
    try {
      const code = parseInt(dec, 10);
      return code > 0 ? String.fromCharCode(code) : '';
    } catch {
      return _match;
    }
  });

  // Then decode named entities
  Object.entries(namedEntities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity.replace(/&/g, '\\&').replace(/;/g, '\\;'), 'g'), char);
  });

  return decoded;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const perPage = searchParams.get('per_page') || '9';
  const page = searchParams.get('page') || '1';
  const postId = searchParams.get('id');
  const slug = searchParams.get('slug');
  const search = searchParams.get('search');
  const year = searchParams.get('year');
  const categoryId = searchParams.get('category');

  try {
    const WP_API_URL = await getWordPressUrl();
    let url = `${WP_API_URL}/posts?per_page=${perPage}&page=${page}&_embed`;

    if (postId) {
      url = `${WP_API_URL}/posts/${postId}?_embed`;
    } else if (slug) {
      url = `${WP_API_URL}/posts?slug=${slug}&_embed`;
    } else {
      // Add search query
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      // Add year filter
      if (year) {
        url += `&after=${year}-01-01T00:00:00&before=${year}-12-31T23:59:59`;
      }

      // Add category filter
      if (categoryId) {
        url += `&categories=${categoryId}`;
      }
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const data = await response.json();

    // Get total pages from header
    const totalPages = response.headers.get('X-WP-TotalPages') || '1';
    const total = response.headers.get('X-WP-Total') || '0';

    // Transform the data
    const posts = Array.isArray(data) ? data : [data];
    const transformedPosts = posts.map((post: any) => {
      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
      const author = post._embedded?.author?.[0];
      const categories = post._embedded?.['wp:term']?.[0] || [];

      return {
        id: post.id,
        title: decodeHtmlEntities(post.title.rendered),
        slug: post.slug,
        excerpt: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '')).substring(0, 150) + '...',
        content: post.content.rendered,
        date: post.date,
        featuredImage: featuredImage ? {
          url: featuredImage.source_url,
          alt: decodeHtmlEntities(featuredImage.alt_text || post.title.rendered),
          sizes: featuredImage.media_details?.sizes || {},
        } : null,
        author: author ? {
          name: author.name,
          avatar: author.avatar_urls?.['48'] || null,
        } : null,
        categories: categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
        link: post.link,
      };
    });

    const jsonResponse = NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        totalPages: parseInt(totalPages),
        total: parseInt(total),
      },
    });

    // Add cache control headers
    // Cache for 1 minute, then revalidate in background
    jsonResponse.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return jsonResponse;
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
