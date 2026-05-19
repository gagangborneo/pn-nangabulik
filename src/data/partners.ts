export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  order: number;
}

export const defaultPartners: Partner[] = [
  {
    id: '1',
    name: 'Mahkamah Agung RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'https://www.mahkamahagung.go.id',
    order: 0,
  },
  {
    id: '2',
    name: 'Kepaniteraan MA RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'https://kepaniteraan.mahkamahagung.go.id/',
    order: 1,
  },
  {
    id: '3',
    name: 'Badan Peradilan Umum MA RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'http://badilum.mahkamahagung.go.id/',
    order: 2,
  },
  {
    id: '4',
    name: 'Badan Urusan Administrasi MA RI',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'http://bua.mahkamahagung.go.id/',
    order: 2,
  },
  {
    id: '5',
    name: 'Badan Pengadilan Tinggi Palangkaraya',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
    websiteUrl: 'http://pt-palangkaraya.go.id/',
    order: 2,
  },
  {
    id: '6',
    name: 'Pemerintah Kabupaten Lamandau',
    logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/LOGO-KABUPATEN-LAMANDAU-1.png',
    websiteUrl: 'https://lamandaukab.go.id',
    order: 3,
  },
];
