'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Client-side component to check maintenance mode
 * Use this in client components that need to redirect to maintenance page
 */
export function MaintenanceCheck() {
  const router = useRouter();

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const response = await fetch('/api/maintenance');
        if (response.ok) {
          const data = await response.json();
          if (data.shouldRedirect) {
            router.push('/maintenance');
          }
        }
      } catch (error) {
        console.error('Error checking maintenance:', error);
      }
    }

    checkMaintenance();
  }, [router]);

  return null;
}
