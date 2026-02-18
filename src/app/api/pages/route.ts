import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const checkOnly = searchParams.get('checkOnly') === 'true';

    // Jika ada parameter url
    if (url) {
      const page = await db.page.findUnique({
        where: { url }
      });
      
      // Jika hanya cek ketersediaan
      if (checkOnly) {
        return NextResponse.json({ exists: !!page });
      }
      
      // Return page data jika ada
      if (page) {
        return NextResponse.json(page);
      } else {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        );
      }
    }

    // Get all pages
    const pages = await db.page.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, title, seoTitle, seoDescription, wordpressSlug, isActive } = body;

    // Validasi
    if (!url || !title || !wordpressSlug) {
      return NextResponse.json(
        { error: 'URL, title, and WordPress slug are required' },
        { status: 400 }
      );
    }

    // Validasi format URL (harus dimulai dengan /)
    if (!url.startsWith('/')) {
      return NextResponse.json(
        { error: 'URL must start with /' },
        { status: 400 }
      );
    }

    // Cek apakah URL sudah digunakan
    const existingPage = await db.page.findUnique({
      where: { url }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'URL already exists' },
        { status: 400 }
      );
    }

    // Buat page baru
    const page = await db.page.create({
      data: {
        url,
        title,
        seoTitle,
        seoDescription,
        wordpressSlug,
        isActive: isActive ?? true
      }
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
