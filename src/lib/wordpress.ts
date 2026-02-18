import { db } from './db';

// Cache for WordPress URL to avoid repeated database queries
let cachedWordPressUrl: string | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the WordPress API URL from database settings
 * Falls back to default URL if not configured
 */
export async function getWordPressUrl(): Promise<string> {
  const defaultUrl = 'https://web.pn-nangabulik.go.id/wp-json/wp/v2';
  
  try {
    // Check cache
    const now = Date.now();
    if (cachedWordPressUrl && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      return cachedWordPressUrl;
    }

    // Fetch from database
    const setting = await db.siteSetting.findUnique({
      where: { key: 'wordpress_url' },
    });

    const url = setting?.value || defaultUrl;
    
    // Update cache
    cachedWordPressUrl = url;
    cacheTimestamp = now;
    
    return url;
  } catch (error) {
    console.error('Error fetching WordPress URL from settings:', error);
    return defaultUrl;
  }
}

/**
 * Clear the WordPress URL cache
 * Useful when settings are updated
 */
export function clearWordPressUrlCache(): void {
  cachedWordPressUrl = null;
  cacheTimestamp = null;
}

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key },
    });
    return setting?.value || null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

/**
 * Get all settings as an object
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const settings = await db.siteSetting.findMany();
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    return settingsObj;
  } catch (error) {
    console.error('Error fetching all settings:', error);
    return {};
  }
}
