import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const slides = await db.pojokInfoSlide.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ slides });
  } catch (error: any) {
    console.error('Error fetching pojok info slides:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const slide = await db.pojokInfoSlide.create({
      data: {
        imageUrl: body.imageUrl,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ slide });
  } catch (error: any) {
    console.error('Error creating pojok info slide:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const slide = await db.pojokInfoSlide.update({
      where: { id },
      data,
    });

    return NextResponse.json({ slide });
  } catch (error: any) {
    console.error('Error updating pojok info slide:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    await db.pojokInfoSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pojok info slide:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
