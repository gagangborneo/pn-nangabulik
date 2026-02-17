'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const defaultFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Bagaimana cara mendaftar perkara di Pengadilan Negeri Nanga Bulik?',
    answer: 'Anda dapat mendaftar perkara melalui layanan E-Court atau datang langsung ke kantor Pengadilan Negeri Nanga Bulik pada jam kerja. Pastikan Anda membawa dokumen-dokumen yang diperlukan seperti KTP, KK, dan dokumen pendukung lainnya.',
    order: 0,
  },
  {
    id: '2',
    question: 'Apa saja dokumen yang diperlukan untuk mengajukan gugatan?',
    answer: 'Dokumen yang diperlukan antara lain: KTP pemohon, Kartu Keluarga, surat kuasa (jika diwakili), dan dokumen pendukung seperti akta nikah, akta kelahiran anak, bukti kepemilikan harta bersama, dan dokumen lain sesuai jenis perkara.',
    order: 1,
  },
  {
    id: '3',
    question: 'Bagaimana cara mengecek jadwal sidang?',
    answer: 'Anda dapat mengecek jadwal sidang melalui website resmi Pengadilan Negeri Nanga Bulik, aplikasi E-Court, atau menghubungi bagian pendaftaran pada jam kerja. Pastikan Anda mengetahui nomor perkara untuk memudahkan pencarian.',
    order: 2,
  },
  {
    id: '4',
    question: 'Apakah ada biaya untuk mengajukan perkara?',
    answer: 'Ya, ada biaya panjar perkara yang besarnya disesuaikan dengan jenis perkara. Namun, bagi masyarakat tidak mampu, dapat mengajukan perkara secara cuma-cuma (prodeo) dengan melampirkan surat keterangan tidak mampu dari kelurahan/kecamatan.',
    order: 3,
  },
  {
    id: '5',
    question: 'Berapa lama proses persidangan biasanya berlangsung?',
    answer: 'Durasi proses persidangan bervariasi tergantung jenis perkara. Untuk perkara perdata biasanya 4-6 bulan, sedangkan perkara pidana bisa lebih cepat. Proses dapat berlangsung lebih lama jika ada pengajuan bukti tambahan atau saksi yang tidak hadir.',
    order: 4,
  },
];

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFAQs);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq');
        const data = await response.json();
        if (data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="w-20 h-1 bg-[#8B0000] mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering ditanyakan seputar layanan pengadilan
          </p>
        </div>

        {/* Accordion FAQ */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-gray-50 rounded-lg px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-[#8B0000] hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
