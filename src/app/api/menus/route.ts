import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all menu items (for admin, show all including inactive)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    
    const menuItems = await db.menuItem.findMany({
      where: admin ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }],
    });

    // Build nested menu structure
    const buildMenuTree = (items: any[], parentId: string | null = null): any[] => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildMenuTree(items, item.id),
        }))
        .sort((a, b) => a.order - b.order);
    };

    const menuTree = buildMenuTree(menuItems, null);

    // Return as 'menus' to match frontend component
    return NextResponse.json({ menus: menuTree });
  } catch (error: any) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, url, parentId, order, openInNewTab } = body;

    if (!label || !url) {
      return NextResponse.json({ error: 'Label dan URL harus diisi' }, { status: 400 });
    }

    const menuItem = await db.menuItem.create({
      data: {
        label,
        url,
        parentId: parentId || null,
        order: order ?? 0,
        openInNewTab: openInNewTab || false,
      },
    });

    return NextResponse.json({ menu: menuItem });
  } catch (error: any) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update menu item (supports partial update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, label, url, parentId, order, isActive, openInNewTab } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID harus diisi' }, { status: 400 });
    }

    // Check if menu exists
    const existing = await db.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Menu tidak ditemukan' }, { status: 404 });
    }

    // Build update data (only include fields that are provided)
    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (url !== undefined) updateData.url = url;
    if (parentId !== undefined) updateData.parentId = parentId || null;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (openInNewTab !== undefined) updateData.openInNewTab = openInNewTab;

    const menuItem = await db.menuItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ menu: menuItem });
  } catch (error: any) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete menu item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID harus diisi' }, { status: 400 });
    }

    // Check if menu exists
    const existing = await db.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Menu tidak ditemukan' }, { status: 404 });
    }

    // Delete children first (cascade)
    await db.menuItem.deleteMany({
      where: { parentId: id },
    });

    await db.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
