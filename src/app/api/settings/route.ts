import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const setting = await db.siteSetting.findUnique({
        where: { key },
      });
      return NextResponse.json({ setting });
    }

    const settings = await db.siteSetting.findMany();
    
    // Convert to object
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create or update setting(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle array of settings
    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        const setting = await db.siteSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        });
        results.push(setting);
      }
      return NextResponse.json({ settings: results });
    }

    // Handle single setting
    const { key, value } = body;
    const setting = await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ setting });
  } catch (error: any) {
    console.error('Error saving setting:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
