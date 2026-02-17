import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FAQ data...');

  // Clear existing FAQs
  await prisma.fAQ.deleteMany();
  console.log('Cleared existing FAQs');

  // Create FAQ data
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'Bagaimana cara mendaftar perkara di Pengadilan Negeri Nanga Bulik?',
        answer: 'Anda dapat mendaftar perkara melalui layanan E-Court atau datang langsung ke kantor Pengadilan Negeri Nanga Bulik pada jam kerja. Pastikan Anda membawa dokumen-dokumen yang diperlukan seperti KTP, KK, dan dokumen pendukung lainnya.',
        order: 0,
        isActive: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Apa saja dokumen yang diperlukan untuk mengajukan gugatan?',
        answer: 'Dokumen yang diperlukan antara lain: KTP pemohon, Kartu Keluarga, surat kuasa (jika diwakili), dan dokumen pendukung seperti akta nikah, akta kelahiran anak, bukti kepemilikan harta bersama, dan dokumen lain sesuai jenis perkara.',
        order: 1,
        isActive: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Bagaimana cara mengecek jadwal sidang?',
        answer: 'Anda dapat mengecek jadwal sidang melalui website resmi Pengadilan Negeri Nanga Bulik, aplikasi E-Court, atau menghubungi bagian pendaftaran pada jam kerja. Pastikan Anda mengetahui nomor perkara untuk memudahkan pencarian.',
        order: 2,
        isActive: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Apakah ada biaya untuk mengajukan perkara?',
        answer: 'Ya, ada biaya panjar perkara yang besarnya disesuaikan dengan jenis perkara. Namun, bagi masyarakat tidak mampu, dapat mengajukan perkara secara cuma-cuma (prodeo) dengan melampirkan surat keterangan tidak mampu dari kelurahan/kecamatan.',
        order: 3,
        isActive: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Berapa lama proses persidangan biasanya berlangsung?',
        answer: 'Durasi proses persidangan bervariasi tergantung jenis perkara. Untuk perkara perdata biasanya 4-6 bulan, sedangkan perkara pidana bisa lebih cepat. Proses dapat berlangsung lebih lama jika ada pengajuan bukti tambahan atau saksi yang tidak hadir.',
        order: 4,
        isActive: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Bagaimana cara mengajukan banding atau kasasi?',
        answer: 'Permohonan banding atau kasasi dapat diajukan melalui Pengadilan Negeri Nanga Bulik dalam jangka waktu yang telah ditentukan setelah putusan dibacakan. Anda perlu mengisi formulir permohonan dan melampirkan dokumen yang diperlukan. Tim pendaftaran akan membantu Anda dalam prosesnya.',
        order: 5,
        isActive: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Apakah saya harus menggunakan jasa pengacara?',
        answer: 'Menggunakan jasa pengacara tidak wajib, namun disarankan untuk membantu Anda dalam proses hukum. Anda dapat beracara sendiri atau menunjuk kuasa hukum sesuai kebutuhan. Untuk masyarakat tidak mampu, tersedia layanan bantuan hukum gratis melalui Pos Bantuan Hukum (Posbakum).',
        order: 6,
        isActive: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Bagaimana cara mendapatkan salinan putusan pengadilan?',
        answer: 'Salinan putusan dapat diminta setelah putusan berkekuatan hukum tetap. Anda dapat mengajukan permohonan salinan putusan ke bagian kepaniteraan dengan membawa identitas diri dan bukti sebagai pihak yang berperkara. Tersedia juga layanan online melalui sistem informasi pengadilan.',
        order: 7,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Successfully created ${faqs.length} FAQs:`);
  faqs.forEach((faq, index) => {
    console.log(`   ${index + 1}. ${faq.question.substring(0, 50)}...`);
  });
}

main()
  .catch((e) => {
    console.error('Error seeding FAQs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
