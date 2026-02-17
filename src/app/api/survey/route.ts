import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Survey API - handles CRUD operations for survey data

// GET - Fetch surveys
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const where: { year?: number } = {};
    if (year) {
      where.year = parseInt(year);
    }

    const surveys = await db.survey.findMany({
      where,
      orderBy: [{ year: 'desc' }, { category: 'asc' }, { quarter: 'asc' }],
    });

    // Also fetch survey links
    const links = await db.surveyLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    // Get unique years
    const years = await db.survey.findMany({
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' },
    });

    return NextResponse.json({
      surveys,
      links,
      years: years.map((y) => y.year),
    });
  } catch (error: unknown) {
    console.error('Error fetching surveys:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Create or update survey
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, category, quarter, percentage, reportUrl } = body;

    const survey = await db.survey.upsert({
      where: {
        year_category_quarter: {
          year: parseInt(year),
          category,
          quarter: parseInt(quarter),
        },
      },
      update: {
        percentage: percentage ? parseFloat(percentage) : null,
        reportUrl: reportUrl || null,
      },
      create: {
        year: parseInt(year),
        category,
        quarter: parseInt(quarter),
        percentage: percentage ? parseFloat(percentage) : null,
        reportUrl: reportUrl || null,
      },
    });

    return NextResponse.json({ survey });
  } catch (error: unknown) {
    console.error('Error saving survey:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update survey
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, percentage, reportUrl } = body;

    const survey = await db.survey.update({
      where: { id },
      data: {
        percentage: percentage ? parseFloat(percentage) : null,
        reportUrl: reportUrl || null,
      },
    });

    return NextResponse.json({ survey });
  } catch (error: unknown) {
    console.error('Error updating survey:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete survey
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const year = searchParams.get('year');

    if (id) {
      await db.survey.delete({ where: { id } });
    } else if (year) {
      // Delete all surveys for a year
      await db.survey.deleteMany({
        where: { year: parseInt(year) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting survey:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
