import { NextRequest, NextResponse } from 'next/server';
import { getWordPressUrl } from '@/lib/wordpress';

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
        title: post.title.rendered,
        slug: post.slug,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        content: post.content.rendered,
        date: post.date,
        featuredImage: featuredImage ? {
          url: featuredImage.source_url,
          alt: featuredImage.alt_text || post.title.rendered,
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

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        totalPages: parseInt(totalPages),
        total: parseInt(total),
      },
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
