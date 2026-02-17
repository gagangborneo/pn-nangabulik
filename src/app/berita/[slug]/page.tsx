'use client';

import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SinglePostView from '@/components/sections/SinglePostView';
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';

export default function BeritaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const handleClose = () => {
    router.push('/berita');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <AutoTTSWrapper>
        <main className="flex-1">
          <SinglePostView slug={slug} onClose={handleClose} />
        </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
  );
}
