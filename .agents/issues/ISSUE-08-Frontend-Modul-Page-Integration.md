# [ISSUE-08] Frontend Modul Page Fixes & Data Integration

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** High  
**Ref:** Laporan Bug Data Dummy di Halaman Modul

---

## Objective

Menghapus sisa *dummy data* (data palsu) yang masih *hardcoded* di halaman `/modul`. Halaman ini harus disinkronkan sepenuhnya (terintegrasi API) menggunakan data modul yang asli dari database, dan semua aksi antarmukanya harus dihidupkan (Search, Filter, Upload).

---

## High Level Scope

### 1. Sinkronisasi Data Modul Asli
- Bersihkan kode dari data statis dummy.
- Panggil API (seperti yang dilakukan pada Dashboard) agar list daftar modul memunculkan file PDF/DOCX yang sudah benar-benar terunggah ke database backend lokal.

### 2. Mengaktifkan Aksi Upload
- Fungsikan kembali tombol "Upload Modul Ajar" di halaman `/modul` agar membuka form / memanggil fungsi yang sama persis saat kita berhasil mengunggah file di Dashboard sebelumnya.

### 3. Fungsionalitas Pencarian & Filter
- Hubungkan *Search Bar* agar daftar modul dapat difilter sesuai dengan nama *file* atau data teks.
- Hidupkan opsi Filter/Sort (misalnya berdasarkan tanggal unggah atau ukuran dokumen) agar user mudah menavigasi modul-modul mereka.

---

## Acceptance Criteria

- [ ] Tidak ada lagi statis/dummy text di table/grid dokumen pada halaman `/modul`. Seluruhnya *real data* dari API.
- [ ] Tombol Upload berhasil menembak endpoint upload dan r-render list dokumen.
- [ ] Mengetik di Search bar atau mengganti nilai Dropdown filter akan memengaruhi daftar dokumen yang tertampil di layar dengan responsif.
