import { NextResponse } from 'next/server';

const WP_API_URL = 'https://web.pn-nangabulik.go.id/wp-json/wp/v2';

export async function GET() {
  try {
    const response = await fetch(`${WP_API_URL}/categories?per_page=50`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter out categories with 0 posts and format
    const categories = data
      .filter((cat: any) => cat.count > 0)
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
      }));

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
