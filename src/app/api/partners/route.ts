import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all partners
export async function GET() {
  try {
    const partners = await db.partner.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }],
    });

    return NextResponse.json({ partners });
  } catch (error: any) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logoUrl, websiteUrl, order } = body;

    const partner = await db.partner.create({
      data: {
        name,
        logoUrl,
        websiteUrl,
        order: order || 0,
      },
    });

    return NextResponse.json({ partner });
  } catch (error: any) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update partner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, logoUrl, websiteUrl, order, isActive } = body;

    const partner = await db.partner.update({
      where: { id },
      data: {
        name,
        logoUrl,
        websiteUrl,
        order,
        isActive,
      },
    });

    return NextResponse.json({ partner });
  } catch (error: any) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete partner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.partner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
