'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function FloatingWhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        const response = await fetch('/api/settings?key=whatsapp_number');
        const data = await response.json();
        if (data.setting?.value) {
          setWhatsappNumber(data.setting.value);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp number:', error);
      }
    };

    fetchWhatsAppNumber();
  }, []);

  if (!isVisible || !whatsappNumber) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed left-6 bottom-6 z-50 group hover:scale-110 transition-transform duration-300 ease-in-out"
      aria-label="Hubungi via WhatsApp"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <Image
          src="https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/Logo-ABA-Pendi-m.png"
          alt="WhatsApp Asisten Virtual"
          fill
          className="object-cover rounded-full"
          priority
        />
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-green-500 opacity-0 group-hover:opacity-20 animate-ping"></div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat dengan ABA PENDI
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
      </div>
    </a>
  );
}
