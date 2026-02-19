// Landing page for PN Nanga Bulik website
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { shouldRedirectToMaintenance } from '@/lib/maintenance';

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
import VisitorCounterSection from '@/components/sections/VisitorCounterSection';

// TTS Components
import { AutoTTSWrapper } from '@/components/ui/auto-tts-wrapper';

export default async function Home() {
  // Check maintenance mode
  const shouldRedirect = await shouldRedirectToMaintenance();
  if (shouldRedirect) {
    redirect('/maintenance');
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <Header />
      <AutoTTSWrapper>
        <main className="flex-1">
          <HeroSection />
          <LogoBannerSection />
          <ZonaIntegritasSection />
          <ProfilPejabatSection />
          <SMAPBannerSection />
          <LayananPublikSection />
          {/* <WadahKeadilanSection /> */}
          <SurveySection />
          <BlogSection />
          <FAQSection />
          <PartnersSection />
          <ContactSection />
          <VisitorCounterSection />
        </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
  );
}
