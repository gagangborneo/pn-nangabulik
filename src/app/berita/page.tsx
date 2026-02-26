import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AllPostsView from '@/components/sections/AllPostsView';
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';
import { MaintenanceCheck } from '@/components/MaintenanceCheck';
import { redirect } from 'next/navigation';
import { shouldRedirectToMaintenance } from '@/lib/maintenance';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BeritaPage() {
  // Ensure no caching
  const headersList = await headers();
  headersList.list(); // Force headers to be read

  // Check maintenance mode
  const shouldRedirect = await shouldRedirectToMaintenance();
  if (shouldRedirect) {
    redirect('/maintenance');
  }

  return (
    <>
      <MaintenanceCheck />
      <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <AutoTTSWrapper>
        <main className="flex-1">
          <AllPostsView />
        </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
    </>
  );
}
