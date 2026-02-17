import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch links by category or all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const admin = searchParams.get('admin') === 'true';

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (!admin) where.isActive = true;

    const links = await db.reportLink.findMany({
      where,
      orderBy: [{ order: 'asc' }],
      include: {
        category: {
          select: { id: true, title: true, slug: true },
        },
        _count: {
          select: { views: true },
        },
      },
    });

    return NextResponse.json({ links });
  } catch (error: any) {
    console.error('Error fetching report links:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, title, url, description, order } = body;

    if (!categoryId || !title || !url) {
      return NextResponse.json({ error: 'CategoryId, title, dan url harus diisi' }, { status: 400 });
    }

    const link = await db.reportLink.create({
      data: {
        categoryId,
        title,
        url,
        description,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ link });
  } catch (error: any) {
    console.error('Error creating report link:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, categoryId, title, url, description, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID harus diisi' }, { status: 400 });
    }

    const existing = await db.reportLink.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Link tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {};
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = url;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const link = await db.reportLink.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ link });
  } catch (error: any) {
    console.error('Error updating report link:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID harus diisi' }, { status: 400 });
    }

    const existing = await db.reportLink.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Link tidak ditemukan' }, { status: 404 });
    }

    await db.reportLink.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting report link:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
