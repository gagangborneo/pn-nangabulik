import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all layanan
export async function GET() {
  try {
    const layanan = await db.layanan.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }],
    });

    return NextResponse.json({ layanan });
  } catch (error: any) {
    console.error('Error fetching layanan:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new layanan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, icon, url, order } = body;

    const layanan = await db.layanan.create({
      data: {
        title,
        description,
        icon,
        url,
        order: order || 0,
      },
    });

    return NextResponse.json({ layanan });
  } catch (error: any) {
    console.error('Error creating layanan:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update layanan
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, icon, url, order, isActive } = body;

    const layanan = await db.layanan.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        url,
        order,
        isActive,
      },
    });

    return NextResponse.json({ layanan });
  } catch (error: any) {
    console.error('Error updating layanan:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete layanan
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.layanan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting layanan:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
