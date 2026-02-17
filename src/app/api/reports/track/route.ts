import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

// POST - Track category view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, linkId } = body;

    // Get IP address from headers
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    const userAgent = headersList.get('user-agent') || null;

    if (categoryId) {
      // Track category view
      const category = await db.reportCategory.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
      }

      await db.reportView.create({
        data: {
          categoryId,
          ipAddress: ip,
          userAgent,
        },
      });

      return NextResponse.json({ success: true, type: 'category' });
    }

    if (linkId) {
      // Track link view/click
      const link = await db.reportLink.findUnique({
        where: { id: linkId },
      });
      if (!link) {
        return NextResponse.json({ error: 'Link tidak ditemukan' }, { status: 404 });
      }

      await db.reportLinkView.create({
        data: {
          linkId,
          ipAddress: ip,
          userAgent,
        },
      });

      return NextResponse.json({ success: true, type: 'link' });
    }

    return NextResponse.json({ error: 'categoryId atau linkId harus diisi' }, { status: 400 });
  } catch (error: any) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Get statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const linkId = searchParams.get('linkId');

    if (categoryId) {
      // Get category stats
      const totalViews = await db.reportView.count({
        where: { categoryId },
      });

      const uniqueVisitors = await db.reportView.groupBy({
        by: ['ipAddress'],
        where: { categoryId },
        _count: true,
      });

      const recentViews = await db.reportView.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      return NextResponse.json({
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        recentViews,
      });
    }

    if (linkId) {
      // Get link stats
      const totalViews = await db.reportLinkView.count({
        where: { linkId },
      });

      const uniqueVisitors = await db.reportLinkView.groupBy({
        by: ['ipAddress'],
        where: { linkId },
        _count: true,
      });

      return NextResponse.json({
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
      });
    }

    // Get all stats
    const categoriesWithStats = await db.reportCategory.findMany({
      include: {
        _count: {
          select: { views: true, links: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    const linksWithStats = await db.reportLink.findMany({
      include: {
        category: { select: { title: true, slug: true } },
        _count: {
          select: { views: true },
        },
      },
      orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }],
    });

    return NextResponse.json({
      categories: categoriesWithStats,
      links: linksWithStats,
    });
  } catch (error: any) {
    console.error('Error getting stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
