import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MenuData {
  label: string;
  url?: string;
  children?: MenuData[];
}

// Menu structure parsed from link-menu-item.txt
const menuStructure: MenuData[] = [
  {
    label: 'Beranda',
    url: 'https://pn-nangabulik.go.id/',
  },
  {
    label: 'Tentang Pengadilan',
    children: [
      {
        label: 'Pengantar dari Ketua Pengadilan',
        url: 'https://pn-nangabulik.go.id/tentang-pengadilan/pengantar-dari-ketua-pengadilan',
      },
      {
        label: 'Visi dan Misi',
        url: 'https://pn-nangabulik.go.id/tentang-pengadilan/visi-dan-misi',
      },
      {
        label: 'Profil Pengadilan',
        children: [
          {
            label: 'Sejarah Pengadilan',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-pengadilan/sejarah-pengadilan',
          },
          {
            label: 'Struktur Organisasi',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-pengadilan/struktur-organisasi',
          },
          {
            label: 'Wilayah Yuridiksi',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-pengadilan/wilayah-yuridiksi',
          },
        ],
      },
      {
        label: 'Tugas Pokok dan Fungsi',
        url: 'https://pn-nangabulik.go.id/tentang-pengadilan/tugas-pokok-dan-fungsi',
      },
      {
        label: 'Profil Hakim dan Pegawai',
        children: [
          {
            label: 'Profil Hakim',
            children: [
              {
                label: 'Ketua',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-hakim/ketua',
              },
              {
                label: 'Wakil Ketua',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-hakim/wakil-ketua',
              },
              {
                label: 'Hakim',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-hakim/hakim',
              },
            ],
          },
          {
            label: 'Profil Pejabat',
            children: [
              {
                label: 'Panitera',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/panitera',
              },
              {
                label: 'Sekretaris',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/sekretaris',
              },
              {
                label: 'Panitera Muda',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/panitera-muda',
              },
              {
                label: 'Kepala Sub Bagian',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/kepala-sub-bagian',
              },
              {
                label: 'Panitera Pengganti',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/panitera-pengganti',
              },
              {
                label: 'Juru Sita / Juru Sita Pengganti',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pejabat/juru-sita-juru-sita-pengganti',
              },
            ],
          },
          {
            label: 'Profil Pegawai',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pegawai',
          },
          {
            label: 'Profil PPPK',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-pppk',
          },
          {
            label: 'Profil PPNPN',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-hakim-dan-pegawai/profil-ppnpn',
          },
        ],
      },
      {
        label: 'Profil Role Model dan Agen Perubahan',
        children: [
          {
            label: 'Profil Role Model',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-role-model-dan-agen-perubahan/profil-role-model',
          },
          {
            label: 'Profil Agen Perubahan',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/profil-role-model-dan-agen-perubahan/profil-agen-perubahan',
          },
        ],
      },
      {
        label: 'Kepaniteraan',
        children: [
          {
            label: 'Kepaniteraan Pidana',
            children: [
              {
                label: 'Uraian Tugas Pidana',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/uraian-tugas-pidana',
              },
              {
                label: 'Proses Persidangan Perkara Pidana',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/proses-persidangan-perkara-pidana',
              },
              {
                label: 'Alur DIVERSI Perkara Pidana Anak',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-diversi-perkara-pidana-anak',
              },
              {
                label: 'Alur Pidana Banding',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-banding',
              },
              {
                label: 'Alur Pidana Kasasi',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-kasasi',
              },
              {
                label: 'Alur Pidana Biasa',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-biasa',
              },
              {
                label: 'Alur Pidana Singkat',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-singkat',
              },
              {
                label: 'Alur Pidana Cepat',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-cepat',
              },
              {
                label: 'Alur Pidana Lalu Lintas (Tilang)',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/alur-pidana-lalu-lintas-tilang',
              },
              {
                label: 'Upaya Hukum Pidana Banding',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-banding',
              },
              {
                label: 'Upaya Hukum Pidana Kasasi',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-kasasi',
              },
              {
                label: 'Upaya Hukum Pidana Peninjauan Kembali',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-peninjauan-kembali',
              },
              {
                label: 'Upaya Hukum Pidana Grasi',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-pidana/upaya-hukum-pidana-grasi',
              },
            ],
          },
          {
            label: 'Kepaniteraan Perdata',
            children: [
              {
                label: 'Uraian Tugas Perdata',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/uraian-tugas-perdata',
              },
              {
                label: 'Alur Mediasi',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/alur-mediasi',
              },
              {
                label: 'Alur Gugatan Sederhana',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/alur-gugatan-sederhana',
              },
              {
                label: 'Formulir Gugatan Sederhana',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-perdata/formulir-gugatan-sederhana',
              },
            ],
          },
          {
            label: 'Kepaniteraan Hukum',
            children: [
              {
                label: 'Uraian Tugas Hukum',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/uraian-tugas-hukum',
              },
              {
                label: 'Alur Pelayanan Meja Pengaduan',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pelayanan-meja-pengaduan',
              },
              {
                label: 'Alur Pelayanan Meja POSBAKUM',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pelayanan-meja-posbakum',
              },
              {
                label: 'Alur Pendaftaran Akte CV',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-akte-cv',
              },
              {
                label: 'Alur Pendaftaran Akte Koperasi/Yayasan/UD/Lembaga',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-akte-koperasi-yayasan-usaha-dagang-lembaga-lsm',
              },
              {
                label: 'Alur Pendaftaran Surat Keterangan E-raterang',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-surat-keterangan-e-raterang',
              },
              {
                label: 'Alur Pendaftaran Surat Kuasa Insidentil',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-surat-kuasa-insidentil',
              },
              {
                label: 'Alur Pendaftaran Surat Kuasa Khusus',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-pendaftaran-surat-kuasa-khusus',
              },
              {
                label: 'Alur Permintaan Informasi Petugas Informasi',
                url: 'https://pn-nangabulik.go.id/tentang-pengadilan/kepaniteraan/kepaniteraan-hukum/alur-permintaan-informasi-kepada-petugas-informasi',
              },
            ],
          },
        ],
      },
      {
        label: 'Sistem Pengelolaan Pengadilan',
        children: [
          {
            label: 'E-Learning',
            url: 'https://elearning.mahkamahagung.go.id/',
          },
          {
            label: 'Kebijakan / Yurisprudensi',
            url: 'https://jdih.mahkamahagung.go.id/',
          },
          {
            label: 'Rencana Strategis',
            url: 'https://silapor.pn-nangabulik.go.id/laporan-sakip/renstra',
          },
          {
            label: 'Manajemen Resiko',
            url: 'https://pn-nangabulik.go.id/images/dokumen/Dokumen%20Manajemen%20Resiko.pdf',
          },
          {
            label: 'Rencana Kerja dan Anggaran',
            children: [
              {
                label: 'RKAKL',
                url: 'https://silapor.pn-nangabulik.go.id/rkakl',
              },
              {
                label: 'DIPA',
                url: 'https://silapor.pn-nangabulik.go.id/dipa',
              },
            ],
          },
          {
            label: 'Pengawasan dan Kode Etik Hakim',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/sistem-pengelolaan-pengadilan/pengawasan-dan-kode-etik-hakim',
          },
        ],
      },
      {
        label: 'PTSP',
        children: [
          {
            label: 'Jenis Layanan',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/ptsp/jenis-layanan',
          },
          {
            label: 'Standar Pelayanan',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/ptsp/standar-pelayanan',
          },
          {
            label: 'Maklumat Pelayanan',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/ptsp/maklumat-pelayanan',
          },
          {
            label: 'Kompensasi Pelayanan',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/ptsp/kompensasi-pelayanan',
          },
        ],
      },
      {
        label: 'Layanan Disabilitas',
        children: [
          {
            label: 'Prosedur Pelayanan Disabilitas',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/layanan-disabilitas/prosedur-pelayanan-bagi-penyandang-disabilitas',
          },
          {
            label: 'Sarana & Prasarana Disabilitas',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/layanan-disabilitas/sarana-prasarana-bagi-penyandang-disabilitas',
          },
        ],
      },
      {
        label: 'Tata Tertib di Pengadilan',
        url: 'https://pn-nangabulik.go.id/tentang-pengadilan/tata-tertib-di-pengadilan',
      },
      {
        label: 'Informasi Perkara',
        children: [
          {
            label: 'Delegasi',
            url: 'https://pn-nangabulik.go.id/tentang-pengadilan/informasi-perkara/delegasi',
          },
          {
            label: 'Statistik Perkara',
            url: 'http://sipp.pn-nangabulik.go.id/statistik_perkara',
          },
        ],
      },
    ],
  },
  {
    label: 'Layanan Publik',
    children: [
      {
        label: 'Cetak Biru MA 2010-2035',
        url: 'https://pn-nangabulik.go.id/images/dokumen/Cetak%20Biru%20Pembaruan%20Peradilan%202010-2035.pdf',
      },
      {
        label: 'Laporan',
        children: [
          {
            label: 'Hasil Penelitian',
            url: 'https://pn-nangabulik.go.id/layanan-publik/laporan/hasil-penelitian',
          },
          {
            label: 'LKjIP',
            url: 'https://silapor.pn-nangabulik.go.id/sakip/lkjip',
          },
          {
            label: 'Daftar Aset dan Inventaris',
            url: 'https://silapor.pn-nangabulik.go.id/aset-inventaris',
          },
          {
            label: 'Laporan Tahunan',
            url: 'https://silapor.pn-nangabulik.go.id/laporan-tahunan',
          },
          {
            label: 'Laporan Realisasi Anggaran',
            url: 'https://silapor.pn-nangabulik.go.id/lra',
          },
          {
            label: 'Laporan Keuangan (CALK)',
            url: 'https://silapor.pn-nangabulik.go.id/laporan-keuangan',
          },
          {
            label: 'SAKIP',
            url: 'https://silapor.pn-nangabulik.go.id/sakip/iku',
          },
          {
            label: 'RKAKL',
            url: 'https://silapor.pn-nangabulik.go.id/rkakl',
          },
          {
            label: 'Laporan Pelayanan Informasi Publik',
            url: 'https://pn-nangabulik.go.id/layanan-publik/laporan/laporan-pelayanan-informasi-publik',
          },
          {
            label: 'LHKPN',
            url: 'https://silapor.pn-nangabulik.go.id/lhkpn',
          },
          {
            label: 'LHKAN',
            url: 'https://silapor.pn-nangabulik.go.id/lhkan',
          },
          {
            label: 'Laporan SKM',
            url: 'https://silapor.pn-nangabulik.go.id/survei',
          },
          {
            label: 'Laporan SPAK',
            url: 'https://silapor.pn-nangabulik.go.id/survei',
          },
          {
            label: 'Laporan Survei Harian',
            url: 'https://silapor.pn-nangabulik.go.id/survei-harian',
          },
        ],
      },
      {
        label: 'Pengumuman',
        children: [
          {
            label: 'Denda Tilang',
            url: 'http://sipp.pn-nangabulik.go.id/list_perkara/type/aHJpaGNZdmxYTzNSRGYyVlZxOWhnRVA5eWZBVm93enZwTDN5anVBWSswV2g5OUVQVmVIQkZrNmdxRDdLcGYyU2dzUWo2T216c0NGdEptQzVpQUc3cUE9PQ==',
          },
          {
            label: 'Lelang Barang dan Jasa',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengumuman/lelang-barang-dan-jasa',
          },
          {
            label: 'Pemberitahuan/Panggilan',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengumuman/pemberitahuan-panggilan-kepada-pihak-yang-tidak-diketahui-alamatnya',
          },
          {
            label: 'Penerimaan Pegawai',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengumuman/penerimaan-pegawai',
          },
          {
            label: 'Pengumuman Lainnya',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengumuman/pengumuman-lainnya',
          },
        ],
      },
      {
        label: 'Prosedur Permohonan Informasi',
        children: [
          {
            label: 'Tentang PPID',
            url: 'https://eppid.pn-nangabulik.go.id/profil/profil-ppid',
          },
          {
            label: 'Daftar Informasi Publik',
            url: 'https://pn-nangabulik.go.id/images/dokumen/InformasiPublik/SK_KPN_168_2025.pdf',
          },
          {
            label: 'Prosedur Permohonan Informasi',
            url: 'https://pn-nangabulik.go.id/layanan-publik/prosedur-permohonan-informasi/permohonan-informasi',
          },
          {
            label: 'Prosedur Pengajuan Keberatan',
            url: 'https://pn-nangabulik.go.id/layanan-publik/prosedur-permohonan-informasi/prosedur-pengajuan-keberatan-informasi',
          },
        ],
      },
      {
        label: 'Pengaduan',
        children: [
          {
            label: 'Alur Pengaduan',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengaduan/alur-pengaduan',
          },
          {
            label: 'Prosedur Pengaduan',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengaduan/prosedur-pengaduan',
          },
          {
            label: 'Formulir Pengaduan Tertulis',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengaduan/formulir-pengaduan-tertulis',
          },
          {
            label: 'Pedoman dan Dasar Hukum',
            url: 'https://pn-nangabulik.go.id/layanan-publik/pengaduan/pedoman-dan-dasar-hukum',
          },
        ],
      },
      {
        label: 'Prosedur Eksekusi',
        url: 'https://pn-nangabulik.go.id/layanan-publik/prosedur-eksekusi',
      },
      {
        label: 'E-BROSUR',
        url: 'https://pn-nangabulik.go.id/layanan-publik/e-brosur',
      },
    ],
  },
  {
    label: 'Layanan Hukum',
    children: [
      {
        label: 'Layanan Hukum Masyarakat Kurang Mampu',
        children: [
          {
            label: 'Peraturan dan Kebijakan',
            url: 'https://pn-nangabulik.go.id/layanan-hukum/layanan-hukum-bagi-masyarakat-kurang-mampu/peraturan-dan-kebijakan',
          },
          {
            label: 'Prosedur Pembebasan Biaya (Prodeo)',
            url: 'https://pn-nangabulik.go.id/layanan-hukum/layanan-hukum-bagi-masyarakat-kurang-mampu/prosedur-pembebasan-biaya-perkara-prodeo',
          },
          {
            label: 'Posbakum',
            url: 'https://pn-nangabulik.go.id/layanan-hukum/layanan-hukum-bagi-masyarakat-kurang-mampu/posbakum',
          },
        ],
      },
      {
        label: 'Prosedur Pengajuan dan Biaya Perkara',
        children: [
          {
            label: 'Prosedur Pengajuan Perkara',
            url: 'https://pn-nangabulik.go.id/layanan-hukum/prosedur-pengajuan-dan-biaya-perkara/prosedur-pengajuan-perkara',
          },
          {
            label: 'Panjar Biaya Perkara',
            url: 'https://pn-nangabulik.go.id/layanan-hukum/prosedur-pengajuan-dan-biaya-perkara/panjar-biaya-perkara',
          },
          {
            label: 'Keputusan Bersama Panjar Biaya',
            url: 'https://pn-nangabulik.go.id/layanan-hukum/prosedur-pengajuan-dan-biaya-perkara/keputusan-bersama-panjar-biaya-perkara',
          },
        ],
      },
      {
        label: 'Pengembalian Sisa Panjar',
        url: 'https://pn-nangabulik.go.id/layanan-hukum/pengembalian-sisa-panjar',
      },
    ],
  },
  {
    label: 'Berita',
    children: [
      {
        label: 'Berita Terkini',
        url: 'https://pn-nangabulik.go.id/berita/berita-terkini',
      },
      {
        label: 'Artikel',
        url: 'https://pn-nangabulik.go.id/berita/artikel',
      },
      {
        label: 'Photo Gallery',
        children: [
          {
            label: 'Kegiatan Pengadilan',
            url: 'https://pn-nangabulik.go.id/berita/photo-gallery/kegiatan-pengadilan',
          },
          {
            label: 'Fasilitas dan Ruangan Publik',
            url: 'https://pn-nangabulik.go.id/berita/photo-gallery/fasilitas-dan-ruangan-untuk-publik',
          },
          {
            label: 'Sarana Persidangan Anak',
            url: 'https://pn-nangabulik.go.id/berita/photo-gallery/sarana-persidangan-anak',
          },
        ],
      },
      {
        label: 'Video Gallery',
        url: 'https://pn-nangabulik.go.id/berita/video-gallery',
      },
    ],
  },
  {
    label: 'Hubungi Kami',
    children: [
      {
        label: 'Alamat',
        url: 'https://pn-nangabulik.go.id/hubungi/alamat',
      },
      {
        label: 'Sosial Media',
        children: [
          {
            label: 'Instagram',
            url: 'https://www.instagram.com/pn_nangabulik/',
          },
          {
            label: 'Facebook',
            url: 'https://www.facebook.com/profile.php?id=100076065040996',
          },
          {
            label: 'Youtube',
            url: 'https://www.youtube.com/channel/UCEviJswA-z7MZ1lze_ZXHsw',
          },
        ],
      },
      {
        label: 'Assisten Virtual ABA PENDI',
        url: 'https://api.whatsapp.com/send/?phone=6282350442244&text=Hai+boleh+saya+bertanya+&app_absent=0',
      },
    ],
  },
  {
    label: 'Reformasi Birokrasi',
    children: [
      {
        label: 'Zona Integritas',
        children: [
          {
            label: 'Area I',
            url: 'https://zi.pn-nangabulik.go.id/',
          },
          {
            label: 'Area II',
            url: 'https://zi.pn-nangabulik.go.id/',
          },
          {
            label: 'Area III',
            url: 'https://zi.pn-nangabulik.go.id/',
          },
          {
            label: 'Area IV',
            url: 'https://zi.pn-nangabulik.go.id/',
          },
          {
            label: 'Area V',
            url: 'https://zi.pn-nangabulik.go.id/',
          },
          {
            label: 'Area VI',
            url: 'https://zi.pn-nangabulik.go.id/',
          },
          {
            label: 'LKE ZI',
            url: 'https://docs.google.com/spreadsheets/d/16K9lYkvRE3Z6_Kw2DtuDgp1opi8F6JBz/edit?usp=sharing&ouid=112288044665780299948&rtpof=true&sd=true',
          },
          {
            label: 'Inovasi Pengadilan',
            url: 'https://pn-nangabulik.go.id/reformasi-birokrasi/zona-integritas/inovasi-pengadilan',
          },
        ],
      },
      {
        label: 'Sertifikasi Mutu Peradilan (AMPUH)',
        children: [
          {
            label: 'SK Tim AMPUH PN Nanga Bulik',
            url: 'https://pn-nangabulik.go.id/images/dokumen/101-KPN-SK%202024-SK%20PENUNJUKAN%20TIM%20AMPUH.pdf',
          },
          {
            label: 'Manual Mutu',
            url: 'https://pn-nangabulik.go.id/images/dokumen/Manual%20Mutu%20Pengadilan%20Negeri%20Nanga%20Bulik%202021.pdf',
          },
          {
            label: 'Sertifikat Akreditasi',
            url: 'https://pn-nangabulik.go.id/images/dokumen/Akreditasi/Sertifikat%20Nilai%20Ampuh%20PN%20Nanga%20Bulik%202024.pdf',
          },
        ],
      },
      {
        label: 'e-Court',
        url: 'https://ecourt.mahkamahagung.go.id',
      },
      {
        label: 'SIPP Banding',
        url: 'https://banding.mahkamahagung.go.id/',
      },
      {
        label: 'Eraterang',
        url: 'https://eraterang.badilum.mahkamahagung.go.id/masuk',
      },
      {
        label: 'E-Pustaka',
        url: 'https://pn-nangabulik.go.id/reformasi-birokrasi/e-pustaka',
      },
    ],
  },
];

async function createMenuItem(
  label: string,
  url: string | undefined,
  parentId: string | null,
  order: number
) {
  return prisma.menuItem.create({
    data: {
      label,
      url: url || '#',
      parentId,
      order,
      isActive: true,
      openInNewTab: url ? url.startsWith('http') : false,
    },
  });
}

async function processMenuItems(
  items: MenuData[],
  parentId: string | null = null,
  startOrder: number = 0
): Promise<number> {
  let currentOrder = startOrder;

  for (const item of items) {
    const created = await createMenuItem(item.label, item.url, parentId, currentOrder);
    console.log(`Created: ${item.label} (order: ${currentOrder})`);
    currentOrder++;

    if (item.children && item.children.length > 0) {
      await processMenuItems(item.children, created.id, 0);
    }
  }

  return currentOrder;
}

async function main() {
  console.log('Deleting existing menu items...');
  await prisma.menuItem.deleteMany({});
  console.log('Existing menu items deleted.');

  console.log('Creating new menu items...');
  await processMenuItems(menuStructure);

  const count = await prisma.menuItem.count();
  console.log(`\nDone! Total menu items created: ${count}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
