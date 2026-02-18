import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TTSProvider } from "@/components/ui/tts-provider";
import VisitorTracker from "@/components/VisitorTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pengadilan Negeri Nanga Bulik - Melayani Dengan Integritas dan Profesionalisme",
  description: "Website resmi Pengadilan Negeri Nanga Bulik. Melayani masyarakat dengan integritas dan profesionalisme dalam penegakan hukum.",
  keywords: ["Pengadilan Negeri", "Nanga Bulik", "Lamandau", "Kalimantan Tengah", "Pengadilan", "Hukum", "Peradilan"],
  authors: [{ name: "Pengadilan Negeri Nanga Bulik" }],
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lambang_Mahkamah_Agung.svg/32px-Lambang_Mahkamah_Agung.svg.png",
  },
  openGraph: {
    title: "Pengadilan Negeri Nanga Bulik",
    description: "Melayani Dengan Integritas dan Profesionalisme",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <TTSProvider>
          <VisitorTracker />
          {children}
          <Toaster />
        </TTSProvider>
        
        {/* All-in-One Accessibility Widget */}
        <Script
          id="aioa-accessibility-widget"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                let aioa_script_tag = document.createElement("script");
                aioa_script_tag.src = "https://www.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js?colorcode=#420083&token=null&position=bottom_right";
                aioa_script_tag.id = "aioa-adawidget";
                aioa_script_tag.defer = "true";
                document.getElementsByTagName("body")[0].appendChild(aioa_script_tag);
              }, 3000);
            `,
          }}
        />
      </body>
    </html>
  );
}
