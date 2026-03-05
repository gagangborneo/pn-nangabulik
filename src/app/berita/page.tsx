import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AllPostsView from '@/components/sections/AllPostsView';
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';
import { MaintenanceCheck } from '@/components/MaintenanceCheck';
import { redirect } from 'next/navigation';
import { shouldRedirectToMaintenance } from '@/lib/maintenance';

export const dynamic = 'force-dynamic';

export default async function BeritaPage() {

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
