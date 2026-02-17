import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Fetch all pejabat
export async function GET() {
  try {
    const pejabat = await db.pejabat.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }],
    });

    return NextResponse.json({ pejabat });
  } catch (error: any) {
    console.error('Error fetching pejabat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new pejabat
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, title, imageUrl, order } = body;

    const pejabat = await db.pejabat.create({
      data: {
        name,
        title,
        imageUrl,
        order: order || 0,
      },
    });

    return NextResponse.json({ pejabat });
  } catch (error: any) {
    console.error('Error creating pejabat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update pejabat
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, title, imageUrl, order, isActive } = body;

    const pejabat = await db.pejabat.update({
      where: { id },
      data: {
        name,
        title,
        imageUrl,
        order,
        isActive,
      },
    });

    return NextResponse.json({ pejabat });
  } catch (error: any) {
    console.error('Error updating pejabat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete pejabat
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

    await db.pejabat.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pejabat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
