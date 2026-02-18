import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const raw = `title (url)
- Pengantar dari Ketua Pengadilan (/tentang-pengadilan/pengantar-dari-ketua-pengadilan)
- Sejarah Pengadilan (/tentang-pengadilan/profil-pengadilan/sejarah-pengadilan)
- Struktur Organisasi (/tentang-pengadilan/profil-pengadilan/struktur-organisasi)
- Wilayah Yuridiksi (/tentang-pengadilan/profil-pengadilan/wilayah-yuridiksi)
- Tugas Pokok dan Fungsi (/tentang-pengadilan/tugas-pokok-dan-fungsi)
- Ketua (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-hakim/ketua)
- Wakil Ketua (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-hakim/wakil-ketua)
- Hakim (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-hakim/hakim)
- Panitera (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/panitera)
- Sekretaris (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/sekretaris)
- Panitera Muda (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/panitera-muda)
- Kepala Sub Bagian (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/kepala-sub-bagian)
- Panitera Pengganti (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/panitera-pengganti)
- Juru Sita / Juru Sita Pengganti (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/juru-sita-juru-sita-pengganti)
- Profil Pegawai (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pegawai)
- Profil PPPK (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pppk)
- Profil PPNPN (/tentang-pengadilan/profil-hakim-dan-pegawai/profil-ppnpn)
- Profil Role Model (/tentang-pengadilan/profil-role-model-dan-agen-perubahan/profil-role-model)
- Profil Agen Perubahan (/tentang-pengadilan/profil-role-model-dan-agen-perubahan/profil-agen-perubahan)
- Uraian Tugas Pidana (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/uraian-tugas-pidana)
- Proses Persidangan Perkara Pidana (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/proses-persidangan-perkara-pidana)
- Alur DIVERSI Perkara Pidana Anak (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-diversi-perkara-pidana-anak)
- Alur Pidana Banding (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-banding)
- Alur Pidana Kasasi (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-kasasi)
- Alur Pidana Biasa (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-biasa)
- Alur Pidana Singkat (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-singkat)
- Alur Pidana Cepat (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-cepat)
- Alur Pidana Lalu Lintas (Tilang) (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-lalu-lintas-tilang)
- Upaya Hukum Pidana Banding (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-banding)
- Upaya Hukum Pidana Kasasi (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-kasasi)
- Upaya Hukum Pidana Peninjauan Kembali (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-peninjauan-kembali)
- Upaya Hukum Pidana Grasi (/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-grasi)
- Uraian Tugas Perdata (/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/uraian-tugas-perdata)
- Alur Mediasi (/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/alur-mediasi)
- Alur Gugatan Sederhana (/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/alur-gugatan-sederhana)
- Formulir Gugatan Sederhana (/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/formulir-gugatan-sederhana)
- Uraian Tugas Hukum (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/uraian-tugas-hukum)
- Alur Pelayanan Meja Pengaduan (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pelayanan-meja-pengaduan)
- Alur Pelayanan Meja POSBAKUM (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pelayanan-meja-posbakum)
- Alur Pendaftaran Akte CV (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-akte-cv)
- Alur Pendaftaran Akte Koperasi/Yayasan/Usaha Dagang/Lembaga/LSM (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-akte-koperasi-yayasan-usaha-dagang-lembaga-lsm)
- Alur Pendaftaran Surat Keterangan E-raterang (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-surat-keterangan-e-raterang)
- Alur Pendaftaran Surat Kuasa Insidentil (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-surat-kuasa-insidentil)
- Alur Pendaftaran Surat Kuasa Khusus (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-surat-kuasa-khusus)
- Alur Permintaan Informasi Kepada Petugas Informasi (/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-permintaan-informasi-kepada-petugas-informasi)
- Pengawasan dan Kode Etik Hakim (/tentang-pengadilan/sistem-pengelolaan-pengadilan/pengawasan-dan-kode-etik-hakim)
- Jenis Layanan (/tentang-pengadilan/ptsp/jenis-layanan)
- Standar Pelayanan (/tentang-pengadilan/ptsp/standar-pelayanan)
- Maklumat Pelayanan (/tentang-pengadilan/ptsp/maklumat-pelayanan)
- Kompensasi Pelayanan (/tentang-pengadilan/ptsp/kompensasi-pelayanan)
- Prosedur Pelayanan Bagi Penyandang Disabilitas (/tentang-pengadilan/layanan-disabilitas/prosedur-pelayanan-bagi-penyandang-disabilitas)
- Sarana & Prasarana Bagi Penyandang Disabilitas (/tentang-pengadilan/layanan-disabilitas/sarana-prasarana-bagi-penyandang-disabilitas)
- Tata Tertib di Pengadilan (/tentang-pengadilan/tata-tertib-di-pengadilan)
- Delegasi (/tentang-pengadilan/informasi-perkara/delegasi)
- Hasil Penelitian (/layanan-publik/laporan/hasil-penelitian)
- Laporan Pelayanan Informasi Publik (/layanan-publik/laporan/laporan-pelayanan-informasi-publik)
- Lelang Barang dan Jasa (/layanan-publik/pengumuman/lelang-barang-dan-jasa)
- Pemberitahuan/Panggilan kepada Pihak yang tidak diketahui alamatnya (/layanan-publik/pengumuman/pemberitahuan-panggilan-kepada-pihak-yang-tidak-diketahui-alamatnya)
- Penerimaan Pegawai (/layanan-publik/pengumuman/penerimaan-pegawai)
- Pengumuman Lainnya (/layanan-publik/pengumuman/pengumuman-lainnya)
- Prosedur Permohonan Informasi (/layanan-publik/prosedur-permohonan-informasi/permohonan-informasi)
- Prosedur Pengajuan Keberatan Informasi (/layanan-publik/prosedur-permohonan-informasi/prosedur-pengajuan-keberatan-informasi)
- Alur Pengaduan (/layanan-publik/pengaduan/alur-pengaduan)
- Prosedur Pengaduan (/layanan-publik/pengaduan/prosedur-pengaduan)
- Formulir Pengaduan Tertulis (/layanan-publik/pengaduan/formulir-pengaduan-tertulis)
- Pedoman dan Dasar Hukum (/layanan-publik/pengaduan/pedoman-dan-dasar-hukum)
- Prosedur Eksekusi (/layanan-publik/prosedur-eksekusi)
- E-BROSUR (/layanan-publik/e-brosur)
- Peraturan dan Kebijakan (/layanan-hukum/layanan-hukum-bagi-masyarakat-kurang-mampu/peraturan-dan-kebijakan)
- Prosedur Pembebasan Biaya Perkara (Prodeo) (/layanan-hukum/layanan-hukum-bagi-masyarakat-kurang-mampu/prosedur-pembebasan-biaya-perkara-prodeo)
- Posbakum (/layanan-hukum/layanan-hukum-bagi-masyarakat-kurang-mampu/posbakum)
- Prosedur Pengajuan Perkara (/layanan-hukum/prosedur-pengajuan-dan-biaya-perkara/prosedur-pengajuan-perkara)
- Panjar Biaya Perkara (/layanan-hukum/prosedur-pengajuan-dan-biaya-perkara/panjar-biaya-perkara)
- Keputusan Bersama Panjar Biaya Perkara (/layanan-hukum/prosedur-pengajuan-dan-biaya-perkara/keputusan-bersama-panjar-biaya-perkara)
- Pengembalian Sisa Panjar (/layanan-hukum/pengembalian-sisa-panjar)
- Kegiatan Pengadilan (/informasi/photo-gallery/kegiatan-pengadilan)
- Fasilitas dan Ruangan untuk Publik (/informasi/photo-gallery/fasilitas-dan-ruangan-untuk-publik)
- Sarana Persidangan Anak (/informasi/photo-gallery/sarana-persidangan-anak)
- Video Gallery (/informasi/video-gallery)
- Alamat (/hubungi/alamat)
- Inovasi Pengadilan (/reformasi-birokrasi/zona-integritas/inovasi-pengadilan)
- E-Pustaka (/reformasi-birokrasi/e-pustaka)b`;

type PageSeed = {
  title: string;
  url: string;
};

function parsePages(input: string): { pages: PageSeed[]; invalid: string[] } {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const pages: PageSeed[] = [];
  const invalid: string[] = [];

  for (const line of lines) {
    if (!line.startsWith('- ')) {
      continue;
    }

    const match = line.match(/^-\s+(.+?)\s*\((\/[^)]+)\)/);
    if (!match) {
      invalid.push(line);
      continue;
    }

    const [, title, url] = match;
    pages.push({
      title: title.trim(),
      url: url.trim(),
    });
  }

  return { pages, invalid };
}

function buildSeoDescription(title: string) {
  return `Informasi ${title} di Pengadilan Negeri Nanga Bulik.`;
}

function buildWordpressSlug(title: string) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' dan ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('Seeding pages...');

  const { pages, invalid } = parsePages(raw);

  if (invalid.length) {
    console.warn('Skipped invalid lines:', invalid);
  }

  await prisma.page.deleteMany();

  const data = pages.map((page) => ({
    url: page.url,
    title: page.title,
    seoTitle: page.title,
    seoDescription: buildSeoDescription(page.title),
    wordpressSlug: buildWordpressSlug(page.title),
    isActive: true,
  }));

  const result = await prisma.page.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} pages`);
  console.log('Page seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
