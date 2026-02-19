import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    const hasSession = !!sessionCookie?.value;

    // Get maintenance mode setting
    const maintenanceSetting = await db.siteSetting.findUnique({
      where: { key: 'maintenance_mode' },
    });

    const isMaintenanceMode = maintenanceSetting?.value === 'true';

    return NextResponse.json({
      maintenanceMode: isMaintenanceMode,
      isAdmin: hasSession,
      shouldRedirect: isMaintenanceMode && !hasSession,
    });
  } catch (error: any) {
    console.error('Error checking maintenance:', error);
    return NextResponse.json(
      { error: 'Failed to check maintenance mode' },
      { status: 500 }
    );
  }
}
