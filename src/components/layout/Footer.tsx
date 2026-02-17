'use client';

import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const serviceLinks = [
    { label: 'SIPP', href: 'https://sipp.pn-nangabulik.go.id/' },
    { label: 'E-Court', href: 'https://ecourt.mahkamahagung.go.id/' },
    { label: 'Jadwal Sidang', href: 'http://sipp.pn-nangabulik.go.id/list_jadwal_sidang/' },
    { label: 'Direktori Putusan', href: 'https://putusan3.mahkamahagung.go.id/' },
    { label: 'Pengaduan', href: 'https://siwas.mahkamahagung.go.id/' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column - Spans 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://web.pn-nangabulik.go.id/wp-content/uploads/2020/01/cropped-logopnnangabuliktanpalatar-1.png"
                alt="Pengadilan Negeri Nanga Bulik"
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="text-xs text-gray-400 leading-tight">MAHKAMAH AGUNG REPUBLIK INDONESIA</div>
                <div className="font-bold text-white text-sm leading-tight">Pengadilan Negeri Nanga Bulik</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md">
              Pengadilan Negeri Nanga Bulik merupakan lembaga peradilan di
              lingkungan Pengadilan Umum yang berkedudukan di Kabupaten
              Lamandau, Kalimantan Tengah.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100076065040996"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-800 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/pn_nangabulik/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-800 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCEviJswA-z7MZ1lze_ZXHsw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-800 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Layanan</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Jl. Pendidikan No. 123, Nanga Bulik, Kab. Lamandau, Kalimantan Tengah
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+62 852 525 2555</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@pn-nangabulik.go.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Pengadilan Negeri Nanga Bulik. Hak Cipta Dilindungi.
            </p>
            <p className="text-gray-500 text-xs">
              Dikelola oleh IT Pengadilan Negeri Nanga Bulik
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
