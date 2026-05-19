// Landing page for PN Nanga Bulik website
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { shouldRedirectToMaintenance } from '@/lib/maintenance';

export const dynamic = 'force-dynamic';

// Layout
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Sections
import HeroSection from '@/components/sections/HeroSection';
import ZonaIntegritasSection from '@/components/sections/ZonaIntegritasSection';
import InformationSlidesSection from '@/components/sections/InformationSlidesSection';
import ProfilPejabatSection from '@/components/sections/ProfilPejabatSection';
import SMAPBannerSection from '@/components/sections/SMAPBannerSection';
import LayananPublikSection from '@/components/sections/LayananPublikSection';
import JadwalSidangSection from '@/components/sections/JadwalSidangSection';
import PengumumanSidangSection from '@/components/sections/PengumumanSidangSection';
import WadahKeadilanSection from '@/components/sections/WadahKeadilanSection';
import MaklumatPojokInfoSection from '@/components/sections/MaklumatPojokInfoSection';
import SurveySection from '@/components/sections/SurveySection';
import BlogSection from '@/components/sections/BlogSection';
import LandingSidebar from '@/components/sections/LandingSidebar';
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
          <LayananPublikSection />
          <div className="relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
                <div className="min-w-0">
                  <MaklumatPojokInfoSection />
                  <BlogSection />
                  <PengumumanSidangSection />
                  <JadwalSidangSection />
                  {/* <ZonaIntegritasSection /> */}
                  {/* <InformationSlidesSection /> */}
                  {/* <ProfilPejabatSection /> */}
                  {/* <SMAPBannerSection /> */}
                  {/* <WadahKeadilanSection /> */}
                  <SurveySection />
                </div>
                <aside>
                  <div className="lg:sticky lg:top-24">
                    <LandingSidebar />
                  </div>
                </aside>
              </div>
            </div>
          </div>
          {/* <FAQSection /> */}
          <PartnersSection />
          <ContactSection />
          <VisitorCounterSection />
        </main>
      </AutoTTSWrapper>
      <Footer />
    </div>
  );
}
