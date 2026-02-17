# Fitur Text-to-Speech (TTS)

## Deskripsi
Fitur TTS memungkinkan pengunjung website untuk mendengarkan teks yang ada di halaman secara otomatis saat mengarahkan kursor (hover) ke elemen teks. Fitur ini sangat berguna untuk meningkatkan aksesibilitas website.

## Cara Kerja

### 1. **Tombol Toggle TTS**
- Terdapat tombol toggle TTS di header website (icon speaker)
- Klik tombol untuk mengaktifkan/menonaktifkan fitur TTS
- Status aktif ditandai dengan icon Volume2, nonaktif dengan VolumeX

### 2. **Hover untuk Mendengar**
Ketika fitur TTS aktif:
- Arahkan kursor ke teks di landing page
- Tunggu sekitar 300ms (delay singkat untuk menghindari trigger tidak sengaja)
- Teks akan dibacakan secara otomatis dalam Bahasa Indonesia
- Teks yang sedang di-hover akan berubah warna menjadi biru
- Pindahkan kursor ke elemen lain atau keluar dari teks untuk menghentikan pembacaan

### 3. **Elemen yang Didukung**
TTS bekerja pada elemen teks berikut:
- Heading (H1, H2, H3, H4, H5, H6)
- Paragraf (P)
- Span dan Div dengan teks
- List items (LI)
- Table cells (TD, TH)
- Labels

### 4. **Elemen yang Dikecualikan**
Untuk pengalaman yang lebih baik, elemen interaktif dikecualikan:
- Button
- Link (A)
- Input fields
- Textarea
- Select dropdowns

## Implementasi Teknis

### Komponen yang Dibuat

1. **`use-tts.ts`** - Custom React hook untuk Web Speech API
   - Mendukung kontrol speak, stop, pause, resume
   - Support bahasa Indonesia (id-ID) sebagai default

2. **`tts-provider.tsx`** - Context provider untuk state global TTS
   - Mengelola status aktif/nonaktif TTS
   - Dapat digunakan di semua komponen

3. **`tts-text.tsx`** - Komponen wrapper untuk teks individual
   - Dapat membungkus elemen teks spesifik
   - Mendukung custom settings (lang, rate, pitch, volume)

4. **`tts-toggle.tsx`** - Tombol toggle untuk mengaktifkan/menonaktifkan TTS
   - Menampilkan icon yang sesuai dengan status
   - Tersedia di header desktop dan mobile

5. **`auto-tts-wrapper.tsx`** - Wrapper otomatis untuk seluruh section
   - Secara otomatis mendeteksi dan mengaktifkan TTS untuk semua teks di dalamnya
   - Tidak perlu memodifikasi setiap komponen secara individual

### Integrasi di Landing Page

```tsx
// Di src/app/layout.tsx - wrap dengan TTSProvider
<TTSProvider>
  {children}
</TTSProvider>

// Di src/app/page.tsx - wrap main content dengan AutoTTSWrapper
<AutoTTSWrapper>
  <main className="flex-1">
    {/* All sections here */}
  </main>
</AutoTTSWrapper>

// Di Header - tambahkan TTSToggle button
<TTSToggle variant="outline" size="icon" />
```

## Browser Support

Fitur TTS menggunakan Web Speech API yang didukung oleh:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (dengan beberapa limitasi)
- ⚠️ Browser lama mungkin tidak support

Jika browser tidak support, fitur TTS tidak akan muncul/bekerja tanpa error.

## Kustomisasi

### Mengubah Bahasa
```tsx
<AutoTTSWrapper lang="en-US"> {/* Ubah ke bahasa lain */}
```

### Mengubah Kecepatan & Pitch
```tsx
<AutoTTSWrapper 
  rate={1.2}  // 0.1 - 10 (default: 1)
  pitch={1.1} // 0 - 2 (default: 1)
  volume={0.8} // 0 - 1 (default: 1)
>
```

### Mengecualikan Elemen Tertentu
```tsx
<AutoTTSWrapper 
  excludeSelector="button, a, input, .no-tts"
>
```

## Penggunaan Manual (Advanced)

Jika ingin kontrol lebih detail, gunakan komponen `TTSText`:

```tsx
import { TTSText } from '@/components/ui/tts-text';

<TTSText 
  as="h1" 
  className="text-4xl font-bold"
  lang="id-ID"
  rate={1.0}
  hoverEffect={true}
>
  Judul yang bisa dibacakan
</TTSText>
```

## Tips Penggunaan

1. **Delay Hover**: Ada delay 300ms sebelum teks dibacakan untuk menghindari trigger tidak sengaja
2. **Visual Feedback**: Teks akan berubah warna menjadi biru saat di-hover (jika TTS aktif)
3. **Mobile**: Fitur TTS lebih optimal di desktop, karena mobile tidak memiliki hover
4. **Performance**: Hanya elemen yang di-hover yang akan diproses, sehingga tidak membebani performa

## Troubleshooting

**Teks tidak terbaca:**
- Pastikan tombol TTS di header dalam status aktif (icon Volume2)
- Periksa browser support Web Speech API
- Coba refresh halaman
- Periksa console untuk error

**Suara terlalu cepat/lambat:**
- Adjust parameter `rate` di AutoTTSWrapper

**Bahasa tidak sesuai:**
- Pastikan parameter `lang` diset ke "id-ID" untuk Bahasa Indonesia
