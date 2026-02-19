import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Construction } from 'lucide-react';

export default async function MaintenancePage() {
  // Check if maintenance mode is still active
  const maintenanceSetting = await db.siteSetting.findUnique({
    where: { key: 'maintenance_mode' },
  });

  // If maintenance mode is OFF, redirect to homepage
  if (maintenanceSetting?.value !== 'true') {
    redirect('/');
  }

  // Fetch settings
  const settings = await db.siteSetting.findMany();
  const settingsObj: Record<string, string> = {};
  settings.forEach(s => {
    settingsObj[s.key] = s.value;
  });

  const siteName = settingsObj.site_name || 'Pengadilan Negeri Nanga Bulik';
  const logoUrl = settingsObj.logo_url || '/logo.png';
  const maintenanceTitle = settingsObj.maintenance_title || 'Website Sedang Dalam Perbaikan';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8 flex justify-center">
          {logoUrl && logoUrl !== '' && (
            <div className="relative w-32 h-32">
              <Image
                src={logoUrl}
                alt={siteName}
                width={128}
                height={128}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-yellow-100 rounded-full">
            <Construction className="w-16 h-16 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {maintenanceTitle}
        </h1>

        <div className="space-y-4 text-gray-600">
          <p className="text-lg">
            {siteName}
          </p>
          <p className="text-base">
            Mohon maaf atas ketidaknyamanannya. Kami sedang melakukan pemeliharaan dan peningkatan sistem untuk memberikan layanan yang lebih baik.
          </p>
          <p className="text-base">
            Website akan segera kembali aktif. Terima kasih atas pengertian Anda.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Untuk informasi lebih lanjut, silakan hubungi kami melalui:
          </p>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Email: info@pn-nangabulik.go.id
          </p>
        </div>
      </div>
    </div>
  );
}
