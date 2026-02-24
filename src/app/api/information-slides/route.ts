import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Fetch all information slides
export async function GET() {
  try {
    const slides = await db.informationSlide.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ slides });
  } catch (error: any) {
    console.error('Error fetching information slides:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new information slide
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const slide = await db.informationSlide.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        description: body.description,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ slide });
  } catch (error: any) {
    console.error('Error creating information slide:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update information slide
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const slide = await db.informationSlide.update({
      where: { id },
      data,
    });

    return NextResponse.json({ slide });
  } catch (error: any) {
    console.error('Error updating information slide:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete information slide
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

    await db.informationSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting information slide:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
