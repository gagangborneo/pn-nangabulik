import { db } from '@/lib/db';
import { cookies } from 'next/headers';

/**
 * Check if maintenance mode is active
 * Returns true if maintenance mode is on AND user is not admin
 */
export async function shouldRedirectToMaintenance(): Promise<boolean> {
  try {
    // Check if user is admin (has session)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    const hasSession = !!sessionCookie?.value;

    // If admin, never redirect
    if (hasSession) {
      return false;
    }

    // Check maintenance mode setting
    const maintenanceSetting = await db.siteSetting.findUnique({
      where: { key: 'maintenance_mode' },
    });

    return maintenanceSetting?.value === 'true';
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return false;
  }
}

/**
 * Get maintenance mode status (for checking only)
 */
export async function isMaintenanceMode(): Promise<boolean> {
  try {
    const maintenanceSetting = await db.siteSetting.findUnique({
      where: { key: 'maintenance_mode' },
    });
    return maintenanceSetting?.value === 'true';
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return false;
  }
}
