# Maintenance Mode Feature

## Fitur yang Ditambahkan

Fitur Mode Maintenance telah ditambahkan ke website, dengan kemampuan untuk:

1. **Mengaktifkan/menonaktifkan mode maintenance** melalui panel admin
2. **Menampilkan halaman maintenance** dengan logo dan judul yang dapat dikustomisasi
3. **Akses admin tetap berjalan** - admin tetap dapat login dan mengakses panel admin meskipun mode maintenance aktif
4. **Kustomisasi pesan maintenance** - dapat mengubah judul halaman maintenance

## Cara Menggunakan

### 1. Mengaktifkan Mode Maintenance

1. Login ke panel admin di `/admin`
2. Buka menu **Pengaturan** 
3. Scroll ke bagian **Mode Maintenance**
4. Toggle switch **Mode Maintenance** untuk mengaktifkan
5. Ubah **Judul Halaman Maintenance** jika diperlukan (default: "Website Sedang Dalam Perbaikan")
6. Klik tombol **Simpan Pengaturan**

### 2. Menonaktifkan Mode Maintenance

1. Login ke panel admin (admin tetap bisa akses meskipun mode maintenance aktif)
2. Buka menu **Pengaturan**
3. Toggle switch **Mode Maintenance** untuk menonaktifkan
4. Klik tombol **Simpan Pengaturan**

## Halaman Maintenance

Halaman maintenance akan ditampilkan di `/maintenance` dan otomatis redirect semua pengunjung publik ke halaman ini ketika mode maintenance aktif.

Halaman ini menampilkan:
- **Logo website** (dari setting `logo_url`)
- **Ikon konstruksi** (Construction icon)
- **Judul maintenance** (dapat dikustomisasi)
- **Nama website** (dari setting `site_name`)
- **Pesan informasi** standar
- **Kontak email** untuk informasi lebih lanjut

## Technical Details

### Files Modified/Created:

1. **SettingsManagement.tsx** - Tambahan form untuk maintenance mode
2. **app/maintenance/page.tsx** - Halaman maintenance landing page (NEW)
3. **middleware.ts** - Check maintenance mode dan redirect
4. **scripts/seed-settings.ts** - Tambahan default settings

### Database Settings:

- `maintenance_mode`: 'true' atau 'false'
- `maintenance_title`: Judul yang ditampilkan di halaman maintenance

### Middleware Logic:

- Cek setting `maintenance_mode` dari database
- Jika `true` dan user **bukan admin**, redirect ke `/maintenance`
- Admin (yang memiliki session) tetap bisa akses semua halaman
- Path yang dikecualikan: `/admin`, `/login`, `/maintenance`, `/api`, `/_next`, `/favicon`

## Testing

Untuk test fitur ini:

1. ✅ Aktifkan mode maintenance di admin settings
2. ✅ Buka website di browser lain (tanpa login) - harus redirect ke halaman maintenance
3. ✅ Pastikan admin tetap bisa akses admin panel
4. ✅ Coba ubah judul maintenance dan cek perubahannya
5. ✅ Nonaktifkan mode maintenance dan pastikan website kembali normal

## Notes

- Mode maintenance **tidak mempengaruhi** akses admin
- Logo yang ditampilkan mengikuti setting `logo_url` di pengaturan website
- Halaman maintenance menggunakan design yang clean dan professional
- Email kontak di halaman maintenance: info@pn-nangabulik.go.id
