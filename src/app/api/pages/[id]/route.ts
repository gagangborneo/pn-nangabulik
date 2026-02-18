import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const page = await db.page.findUnique({
      where: { id }
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { url, title, seoTitle, seoDescription, wordpressSlug, isActive } = body;

    // Validasi
    if (!url || !title || !wordpressSlug) {
      return NextResponse.json(
        { error: 'URL, title, and WordPress slug are required' },
        { status: 400 }
      );
    }

    // Validasi format URL
    if (!url.startsWith('/')) {
      return NextResponse.json(
        { error: 'URL must start with /' },
        { status: 400 }
      );
    }

    // Cek apakah URL sudah digunakan oleh page lain
    const existingPage = await db.page.findUnique({
      where: { url }
    });

    if (existingPage && existingPage.id !== id) {
      return NextResponse.json(
        { error: 'URL already exists' },
        { status: 400 }
      );
    }

    // Update page
    const page = await db.page.update({
      where: { id },
      data: {
        url,
        title,
        seoTitle,
        seoDescription,
        wordpressSlug,
        isActive
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    await db.page.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
