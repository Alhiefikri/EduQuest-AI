# Pull Request / Hasil Kerja untuk [ISSUE-08]

**Status execution:** Berhasil
**Branch:** `feature/issue-08`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/16

---

## Changes:
- Menghapus semua data dummy/hardcoded dari halaman Modul Ajar
- Connect ke real API via `useDocuments()` hook (sama seperti Dashboard)
- Menambahkan UploadModal component dengan drag & drop
- Menambahkan search bar yang berfungsi filter berdasarkan nama file
- Menambahkan dropdown filter format (Semua, PDF, DOCX)
- Menambahkan dropdown sort (Terbaru, Terlama, Nama A-Z, Ukuran)
- Menambahkan fungsi delete dengan konfirmasi dan loading state
- Menambahkan loading skeleton, error state, dan empty state
- Format ukuran file dalam MB dan tanggal dalam locale Indonesia

## Acceptance Criteria Checklist:
- [x] Tidak ada lagi statis/dummy text di grid dokumen, full real data dari API
- [x] Tombol Upload berhasil menembus endpoint upload dan otomatis merender ulang
- [x] Kotak pencarian (Search) dapat menyaring daftar dokumen berdasarkan nama modul

## Cara Test:
1. Buka halaman `/modul`
2. Klik "Upload Modul" → upload file PDF atau DOCX
3. Verifikasi file muncul di tabel dengan data real
4. Ketik di search bar → list terfilter berdasarkan nama
5. Ubah filter format → list terfilter berdasarkan tipe
6. Ubah urutan sort → list ter-sort sesuai pilihan
7. Klik delete → konfirmasi → file terhapus dari list

Tolong Senior Agent review kode saya lewat branch ini.
