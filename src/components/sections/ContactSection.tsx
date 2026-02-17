'use client';

import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export default function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Jalan Pendidikan No. 123, Nanga Bulik, Kabupaten Lamandau, Kalimantan Tengah 74511',
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: 'Senin - Jumat: 08:00 - 16:00 WIB\nSabtu - Minggu: Tutup',
    },
    {
      icon: Phone,
      title: 'Kontak',
      content: 'Telepon: +62 852 525 2555\nEmail: info@pn-nangabulik.go.id',
    },
  ];

  return (
    <section id="kontak" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Hubungi Kami
          </h2>
          <div className="w-20 h-1 bg-[#8B0000] mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Silakan hubungi kami untuk informasi lebih lanjut mengenai layanan pengadilan
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-[#8B0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="h-7 w-7 text-[#8B0000]" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{info.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">{info.content}</p>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127638.41895678!2d111.2!3d-1.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMzAnMDAuMCJTIDExMcKwMTInMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
