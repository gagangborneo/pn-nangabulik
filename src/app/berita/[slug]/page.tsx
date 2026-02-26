import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SinglePostView from '@/components/sections/SinglePostView';
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';
import { MaintenanceCheck } from '@/components/MaintenanceCheck';
import { shouldRedirectToMaintenance } from '@/lib/maintenance';
import { redirect } from 'next/navigation';
import { getWordPressUrl } from '@/lib/wordpress';

// export const dynamic = 'force-dynamic';

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Check maintenance mode
  const shouldRedirect = await shouldRedirectToMaintenance();
  if (shouldRedirect) {
    redirect('/maintenance');
  }

  const { slug } = await params;

  return (
    <>
      <MaintenanceCheck />
      <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <AutoTTSWrapper>
        <main className="flex-1">
          <SinglePostView slug={slug} />
        </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
    </>
  );
}
