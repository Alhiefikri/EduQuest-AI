# [ISSUE-09] Bug: Generate Soal Error & Modul Ajar Action Buttons

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** High  
**Type:** Bug Fix

---

## Objective

Memperbaiki dua bug yang ditemukan saat pengujian aplikasi secara langsung di browser.

---

## Bug 1: "Modul Ajar Tidak Ditemukan" Saat Generate Soal

**Repro Steps:**
1. Buka halaman `/soal/generate`
2. Pilih modul dari dropdown (mode "Dari Modul Ajar")
3. Klik tombol "Generate Bank Soal"
4. Muncul error: *"Modul ajar tidak ditemukan"*

**Root Cause (Dugaan):**  
Dropdown modul di halaman Generate kini menggunakan `id` dokumen (`Document`), padahal backend endpoint `/api/v1/soal/generate` mengharapkan `id` dari model `ModulAjar` (beda tabel). Perlu dipastikan field `modul_id` yang dikirim ke API adalah ID yang benar dan tabel yang benar.

**Expected:** Soal berhasil di-generate berdasarkan konten modul yang dipilih.

---

## Bug 2: Tidak Ada Aksi View/Edit/Delete di Halaman `/modul`

**Repro Steps:**
1. Buka halaman `/modul`
2. Lihat daftar file dokumen yang sudah terupload
3. Tidak ada tombol untuk membuka detail, mengedit metadata, atau menghapus modul

**Expected:**
- Setiap baris/card dokumen harus memiliki tombol aksi.
- **Hapus**: memanggil `DELETE /api/v1/documents/{id}` dan refresh list.
- **Detail/Preview**: menampilkan metadata dokumen (ukuran, jumlah halaman, konten teks yang sudah di-extract).

---

## Acceptance Criteria

- [ ] Klik "Generate" dengan modul yang dipilih từ dropdown tidak lagi mengembalikan error 404.
- [ ] Konten modul yang dipilih berhasil digunakan oleh AI untuk membuat soal.
- [ ] Halaman `/modul` memiliki tombol "Hapus" yang berfungsi pada setiap item dokumen.
- [ ] (Bonus) Tombol atau modal untuk melihat detail/preview teks konten dokumen tersedia.
