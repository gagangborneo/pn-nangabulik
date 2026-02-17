'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AllPostsView from '@/components/sections/AllPostsView';
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';

export default function BeritaPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <AutoTTSWrapper>
        <main className="flex-1">
          <AllPostsView onClose={handleClose} />
        </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
  );
}
