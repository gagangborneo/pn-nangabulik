import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TTSProvider } from "@/components/ui/tts-provider";

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
          {children}
          <Toaster />
        </TTSProvider>
      </body>
    </html>
  );
}
