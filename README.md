# Da7A Portfolio

Next.js 14 (App Router) + Tailwind CSS 3 + Anime.js v4 + Supabase.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi nilai Supabase & YouTube
npm run dev                  # http://localhost:3000
npm run build && npm start   # produksi
```

## Supabase (tombol Like)

1. Buat project di supabase.com.
2. Buka **SQL Editor**, jalankan isi `supabase.sql` (tabel `likes`, proyek, admin, RLS, dan Realtime).
3. Salin **Project URL** dan **anon key** ke `.env.local`.
4. Buat atau undang akun admin di **Authentication > Users**.
5. Jalankan query berikut di SQL Editor dengan email akun tersebut:

	```sql
	insert into public.project_admins (user_id)
	select id from auth.users where email = 'EMAIL_ADMIN_ANDA'
	on conflict (user_id) do nothing;
	```

6. Buka `/admin` di situs dan masuk menggunakan email/password akun tersebut. Halaman ini tidak ditautkan dari main page; RLS membatasi operasi tulis hanya untuk akun di `project_admins`.

Jumlah like = jumlah baris di tabel `likes`. Setiap klik menambah satu baris, dan counter diperbarui live (Realtime + polling cadangan 20 detik). Tanpa env Supabase, tombol tetap berfungsi secara lokal.

Proyek publik dibaca dari tabel `projects`. Foto showcase yang diunggah dari `/admin` disimpan inline sebagai data URL pada array `projects.images` (maksimal 1 MB per foto dan 5 MB total per proyek). URL publik atau path file di folder `public/` juga tetap didukung. Kolaborator bersifat opsional dan dapat berisi beberapa nama.

## Konten yang perlu diganti

| Apa | Di mana |
| --- | --- |
| ID video YouTube | `NEXT_PUBLIC_YOUTUBE_ID` di `.env.local` |
| Link sosial, email tujuan form | `src/lib/config.ts` |
| Daftar proyek: nama, deskripsi, tanggal dibuat/diperbarui, teknologi, gambar showcase (`images`), link | `src/lib/projects.ts` |
| Kolase slide About | `public/images/gallery/` (what / who / why) |
| Ikon sosial | `public/images/icons/` |
| Semua teks EN / IND | `src/lib/i18n.tsx` |
| Foto & logo | `public/images/` |

## Struktur

- `src/components/Loader.tsx` loading screen (Anime.js)
- `src/components/Hero.tsx` bentuk dengan idle animation
- `src/components/About.tsx` video, like, slider 3 slide
- `src/components/Projects.tsx` tab, marquee, kartu
- `src/components/Reveal.tsx` animasi masuk saat scroll
- `src/components/Assemble.tsx` efek "menyusun halaman" per section
- `src/components/ProjectModal.tsx` popup detail proyek (slide dari bawah)
