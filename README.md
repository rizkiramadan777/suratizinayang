# 📜 SI-IZIN AYANG — Portal Resmi Izin Pasangan (KIP-RI)

Aplikasi web romantis & humoris berbasis **Next.js (App Router)** dan **Tailwind CSS**, dirancang khusus untuk pasangan agar pihak pria dapat membuat surat permohonan izin (futsal, nongkrong, mabar, riding, dsb.) secara resmi dan pihak wanita (Ayang) dapat memeriksa, menambahkan klausul/syarat, serta membubuhkan tanda tangan digital & stempel resmi.

Dioptimalkan secara penuh untuk tampilan **Mobile Smartphone & Tablet**.

---

## ✨ Fitur Utama

1. **Format Dokumen Resmi Kenegaraan yang Humoris**:
   - Kop Surat Resmi: *"Kementerian Hubungan & Kasih Sayang RI - Direktorat Jenderal Pengendalian Nongkrong"*
   - Lambang Garuda Asmara & Pita Kebangsaan Cinta
   - Nomor Registrasi Surat resmi otomatis (e.g. `042/IZIN-FUTSAL/KIP-RI/X/2026`)
   - e-Materai Asmara Rp 10.000.000 (Sepuluh Juta Sayang)
   - Stempel Cap Basah Bergerak (*DISETUJUI RESMI*, *ACC BERSYARAT*, atau *DITOLAK*)

2. **Formulir Pengajuan Izin Cepat**:
   - Pilihan kategori preset: ⚽ Futsal, ☕ Nongkrong, 🎮 Mabar, 🏍️ Sunmori, 🧋 Ngopi, 👥 Reuni.
   - Penentuan jam mulai & jam batas malam (curfew).
   - Daftar teman/saksi di tempat agar tidak curiga.
   - Pakta Integritas (Janji wajib PAP tiap jam, tidak melirik cewek lain, bawain makanan, dsb.).
   - Pad Tanda Tangan Digital Pemohon (support sentuhan jari/stylus di HP).

3. **Meja Pengesahan & Tanda Tangan Ayang**:
   - **Disetujui Penuh (ACC)**: Langsung disahkan dengan ledakan confetti!
   - **Disetujui Bersyarat**: Ayang bisa menambahkan tuntutan wajib (beliin seblak, boba, denda telat, dsb.).
   - **Ditolak**: Dengan opsi alasan lucu.
   - Touch Signature Pad dengan pilihan warna tinta (Biru Dokumen Resmi, Hitam, Merah).

4. **Kirim & Bagikan Instan**:
   - Tombol **Kirim ke WhatsApp Ayang** dengan template pesan resmi & manis.
   - Salin Link Interaktif (bisa langsung dibuka Ayang di smartphone tanpa install aplikasi).
   - Unduh Surat Sah bermaterai dalam format foto **PNG** kualitas HD.

5. **Penyimpanan Fleksibel**:
   - **Mode Zero-Config**: Berjalan otomatis menggunakan LocalStorage + URL State.
   - **Mode Cloud Database (Supabase)**: Mendukung sinkronisasi real-time antar perangkat dengan skema database yang sudah disediakan (`supabase-schema.sql`).

---

## 🚀 Menjalankan di Lokal (Development)

Pastikan Node.js sudah terinstal:

```bash
# Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser atau buka dari smartphone Anda di jaringan WiFi yang sama (`http://<ip-komputer>:3000`).

---

## 🌐 Cara Deploy ke Vercel (Gratis & Sangat Cepat)

### Langkah 1: Push ke GitHub / GitLab
1. Inisialisasi Git di folder ini:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi portal si-izin ayang"
   ```
2. Buat repository baru di [GitHub](https://github.com/new).
3. Hubungkan dan push:
   ```bash
   git remote add origin https://github.com/username/si-izin-ayang.git
   git branch -M main
   git push -u origin main
   ```

### Langkah 2: Deploy di Vercel
1. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **"Add New..."** → **"Project"**.
3. Pilih repository yang baru dibuat, lalu klik **"Import"**.
4. *(Opsional)* Jika ingin mengaktifkan sinkronisasi database cloud Supabase, masukkan di bagian **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   *(Jika tidak diisi, aplikasi tetap 100% berjalan normal via URL Link & LocalStorage).*
5. Klik **"Deploy"**. Dalam ~1 menit website langsung online dengan domain gratis seperti `https://si-izin-ayang.vercel.app`!

---

## 🗄️ Menghubungkan Supabase Cloud (Opsional)

1. Buat project baru di [Supabase](https://supabase.com).
2. Buka menu **SQL Editor** di dashboard Supabase.
3. Buka file [supabase-schema.sql](file:///c:/xampp/htdocs/izin/supabase-schema.sql), salin kodenya, dan klik **Run**.
4. Ambil URL dan Anon Key dari menu **Project Settings → API**.
5. Masukkan ke `.env.local` di lokal atau ke menu **Pengaturan Pasangan** langsung di dalam website!
