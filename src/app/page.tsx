'use client';

// Landing page for PN Nanga Bulik website
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Layout
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Sections
import HeroSection from '@/components/sections/HeroSection';
import LogoBannerSection from '@/components/sections/LogoBannerSection';
import ZonaIntegritasSection from '@/components/sections/ZonaIntegritasSection';
import ProfilPejabatSection from '@/components/sections/ProfilPejabatSection';
import SMAPBannerSection from '@/components/sections/SMAPBannerSection';
import LayananPublikSection from '@/components/sections/LayananPublikSection';
import WadahKeadilanSection from '@/components/sections/WadahKeadilanSection';
import SurveySection from '@/components/sections/SurveySection';
import BlogSection from '@/components/sections/BlogSection';
import FAQSection from '@/components/sections/FAQSection';
import PartnersSection from '@/components/sections/PartnersSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Admin Toggle Button */}
      <Button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 shadow-lg z-50"
        onClick={() => router.push('/login')}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Header />
      <main className="flex-1">
        <HeroSection />
        <LogoBannerSection />
        <ZonaIntegritasSection />
        <ProfilPejabatSection />
        <SMAPBannerSection />
        <LayananPublikSection />
        <WadahKeadilanSection />
        <SurveySection />
        <BlogSection />
        <FAQSection />
        <PartnersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
