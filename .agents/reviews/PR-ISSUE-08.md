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

---

## Commit 2: Review Round 1 Fixes

Setelah review round 1 dari Senior Agent, berikut 2 bug yang ditemukan di `GenerateSoal.tsx` dan sudah diperbaiki:

### 🔴 Bug 1: Dropdown Modul Hardcoded (Data Palsu)

- **Masalah:** Dropdown modul menggunakan ID hardcoded (`modul-1`, `modul-2`, `modul-3`) yang tidak ada di database. Jika user memilih, backend return `404: Modul tidak ditemukan`.
- **Fix:** Ganti dengan data real dari `useDocuments()` hook. Dropdown sekarang menampilkan `doc.filename` dari semua dokumen yang sudah diupload.
- **Files:** `GenerateSoal.tsx`

### 🔴 Bug 2: Default State Hardcoded

- **Masalah:** `mataPelajaran` default "Matematika" dan `topik` default "Persamaan Linear Satu Variabel" — seolah-olah sudah diisi user.
- **Fix:** Ganti kedua default menjadi string kosong `""` dan tambahkan `placeholder` attribute untuk petunjuk user.
- **Files:** `GenerateSoal.tsx`

### Test Results:
```
npx tsc --noEmit → 0 errors
```
