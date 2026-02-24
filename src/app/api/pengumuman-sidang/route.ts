import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Fetch all pengumuman sidang
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Check if db.pengumumanSidang exists
    if (!db.pengumumanSidang) {
      console.warn('PengumumanSidang model not available');
      return NextResponse.json({
        items: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const [items, total] = await Promise.all([
      db.pengumumanSidang.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        skip,
        take: limit,
      }),
      db.pengumumanSidang.count({
        where: { isActive: true },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching pengumuman sidang:', error);
    // Return empty data instead of error
    const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10');
    return NextResponse.json({
      items: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    });
  }
}

// POST - Create new pengumuman sidang
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Get the highest order value
    const maxOrder = await db.pengumumanSidang.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const item = await db.pengumumanSidang.create({
      data: {
        title: body.title,
        url: body.url,
        description: body.description,
        order: (maxOrder?.order ?? -1) + 1,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ item });
  } catch (error: any) {
    console.error('Error creating pengumuman sidang:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update pengumuman sidang
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const item = await db.pengumumanSidang.update({
      where: { id },
      data,
    });

    return NextResponse.json({ item });
  } catch (error: any) {
    console.error('Error updating pengumuman sidang:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete pengumuman sidang
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.pengumumanSidang.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pengumuman sidang:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
