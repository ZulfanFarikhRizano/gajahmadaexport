# Gajah Mada Export — Website Lengkap

Landing page + halaman kategori produk + galeri + panel admin tersembunyi.
Next.js (App Router), Tailwind, Motion, WebGL, dan Supabase. Siap deploy ke
Vercel.

## Struktur halaman

| Halaman | Path | Isi |
|---|---|---|
| Home | `/` | Hero animasi (black hole shader, warna batik) → gallery spill (coverflow) → proses produksi → CTA WhatsApp |
| Galeri penuh | `/gallery` | Grid kotak semua produk, gambar besar + caption singkat |
| About Us | `/about` | Teks profil perusahaan (bisa diedit dari admin) |
| Product | `/product/[kategori]` | 9 kategori: Chair & Bench, Footstool, Hanging Chair, Shelving & Storage, Table Set, Barcart & Buffet, Bed & Bedhead, Daybed, Mirror & Wall Art |
| Contact Us | `/contact` | Tombol chat WhatsApp langsung |
| Admin | `/admin/login` → `/admin/dashboard` | **Tidak ada link di UI mana pun** — buka dengan tap logo di navbar 5x dalam 1.5 detik |

---

## 1. Setup Supabase

1. Buat project di [supabase.com](https://supabase.com/dashboard).
2. **SQL Editor** → jalankan `supabase/schema.sql` (bikin tabel `products`, `site_content`, **dan bucket storage `uploads`** — langkah ini sering kelewat dan menyebabkan upload gambar gagal).
3. Jalankan `supabase/seed.sql` (isi data awal — logo & foto produk pakai placeholder, ganti lewat dashboard admin setelah login pertama).
4. **Project Settings → API**, catat:
   - `Project URL` (bagian depan saja, **tanpa** `/rest/v1/` di belakang) → `SUPABASE_URL`
   - key **`service_role`** (bukan `anon`) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Jalankan lokal

```bash
npm install
cp .env.example .env
```

Isi `.env`:
```
ADMIN_PASSWORD=password-kuat-anda
ADMIN_SESSION_TOKEN=<hasil dari: openssl rand -hex 32>
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role key dari Supabase>
```

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 3. Deploy ke Vercel

1. Push ke GitHub → Import project di [vercel.com](https://vercel.com/new).
2. **Settings → Environment Variables** → tambahkan 4 variabel yang sama seperti `.env` (centang Production **dan** Preview).
3. Deploy.

---

## 4. Cara pakai admin tersembunyi

1. Di halaman mana pun, **tap/klik logo di navbar 5 kali** dalam 1.5 detik.
2. Masuk dengan `ADMIN_PASSWORD`. Kalau ternyata sesi lama masih aktif, ada link kecil "Keluar dari sesi ini" di bawah tombol Masuk.
3. Dashboard punya 2 tab:
   - **Logo & Teks Website** — ganti logo, nama website, judul/sub-judul hero, nomor WhatsApp, alamat, teks About Us. Setelah upload logo, **klik "Simpan Perubahan"** — upload dan simpan adalah dua langkah terpisah.
   - **Produk** — tambah/edit/hapus produk. Setelah upload gambar produk, klik **"Tambah Produk"** / **"Simpan Perubahan"** untuk benar-benar menyimpannya ke database.
4. Kalau ada yang gagal (upload atau simpan), sekarang muncul **notifikasi merah** di pojok kanan bawah menjelaskan kenapa — sebelumnya gagal secara diam-diam, itulah kenapa terasa "tidak tersimpan".

---

## 5. Debug log sesi ini

Bug/perbaikan dari feedback screenshot Anda:

1. **Upload/simpan gagal tanpa pemberitahuan apa pun** → dashboard sekarang menampilkan pesan error yang jelas (misalnya kalau bucket `uploads` di Supabase belum dibuat) alih-alih diam saja.
2. **Logo & foto produk broken image** → penyebabnya path default (`/images/logo.png`, `/images/chair-01.jpg`) memang tidak pernah ada filenya di server. Diganti dengan placeholder SVG yang selalu valid, dan `seed.sql` tidak lagi mereferensikan file lokal. Ditambahkan juga komponen `SafeImage` yang otomatis fallback ke placeholder kalau URL gambar dari database ternyata rusak.
3. **Halaman login admin tidak ada tombol keluar** → ditambahkan link "Keluar dari sesi ini" untuk kasus sesi lama masih aktif.
4. **`/gallery` diganti dari carousel jadi grid kotak** (gambar besar + caption kecil di bawahnya), sesuai referensi Anda — carousel-nya sekarang eksklusif dipakai di Home sebagai preview singkat saja.
5. **Navbar diganti jadi putih dengan corak batik** — pola garis diagonal khas parang, sangat tipis (opacity 8%) supaya tidak mengganggu keterbacaan teks.
6. **Kode shader black hole Anda dipasang di Home**, warnanya diganti dari oranye default ke palet batik situs ini: emas hangat di tepi dalam (`#F6E7C1`), brass di tengah (`#B8935A`), plum gelap di tepi luar (`#432B44`) — fisika & animasinya tidak diubah sama sekali, cuma tiga warna default-nya. Diberi setting `steps`/`resolution` lebih hemat karena ini dipasang di halaman katalog produk, bukan halaman showcase khusus.

---

## ⚠️ Yang masih perlu Anda perhatikan

1. **`SUPABASE_SERVICE_ROLE_KEY` harus tetap rahasia** — jangan pernah beri prefix `NEXT_PUBLIC_`, jangan commit `.env` ke git.
2. Shader black hole di Home itu WebGL cukup berat (raymarching per-pixel) — sudah ada fallback otomatis untuk perangkat lemah/tanpa GPU (turun resolusi, atau disembunyikan total kalau WebGL tidak didukung), tapi kalau nanti terasa membebani HP low-end, turunkan lagi `steps` dan `resolution` di `components/hero-intro.tsx`.
3. Auth admin masih sederhana (1 password + cookie token) — cukup untuk satu pemilik situs.
4. Selalu akses lewat **HTTPS** di production (otomatis di Vercel).
