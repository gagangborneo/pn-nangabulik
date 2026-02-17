import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all categories (public only gets active ones)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';

    const categories = await db.reportCategory.findMany({
      where: admin ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }],
      include: {
        _count: {
          select: { links: true, views: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching report categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, description, icon, order } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title dan slug harus diisi' }, { status: 400 });
    }

    // Check if slug exists
    const existing = await db.reportCategory.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 });
    }

    const category = await db.reportCategory.create({
      data: {
        title,
        slug,
        description,
        icon: icon || 'FileText',
        order: order ?? 0,
      },
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Error creating report category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, slug, description, icon, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID harus diisi' }, { status: 400 });
    }

    const existing = await db.reportCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const slugExists = await db.reportCategory.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await db.reportCategory.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Error updating report category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID harus diisi' }, { status: 400 });
    }

    const existing = await db.reportCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    await db.reportCategory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting report category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
