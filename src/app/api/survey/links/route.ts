import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch survey links
export async function GET() {
  try {
    const links = await db.surveyLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ links });
  } catch (error: unknown) {
    console.error('Error fetching survey links:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Create survey link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, order } = body;

    const link = await db.surveyLink.create({
      data: {
        title,
        url,
        order: order || 0,
      },
    });

    return NextResponse.json({ link });
  } catch (error: unknown) {
    console.error('Error creating survey link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update survey link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, url, isActive, order } = body;

    const link = await db.surveyLink.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(url !== undefined && { url }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ link });
  } catch (error: unknown) {
    console.error('Error updating survey link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete survey link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await db.surveyLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting survey link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
