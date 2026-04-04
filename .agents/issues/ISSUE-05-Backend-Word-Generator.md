# [ISSUE-05] Backend Word Generator Service

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** High  
**Ref:** `PRD.md` Section 4.1 (F4: Custom Word Template)

---

## Objective

Membuat service backend untuk mengekspor data soal yang telah di-generate oleh AI ke dalam format file Word (`.docx`). Service ini memungkinkan user mengunggah template kustom (menyediakan kop surat) lalu sistem akan meletakkan daftar soal ke dalamnya.

---

## High Level Scope

### 1. Template Management Endpoint
- Endpoint untuk upload template `.docx`.
- Endpoint untuk melihat daftar template Word yang tersedia (list & detail).
- Simpan file template di direktori aman.

### 2. Word Generation Endpoint
- Endpoint untuk trigger pembuatan file `.docx`. Endpoint ini menerima ID Soal dan ID Template.
- Ambil data soal format JSON dari database, dan tulis ke file Word yang sudah diplih menggunakan library `python-docx`.
- Posisikan setiap pertanyaan, pilihan A-D, dan kunci jawaban/pembahasan dengan formatting sederhana (paragraf/list).

### 3. File Download
- Endpoint untuk mengirimkan (download) file `.docx` hasil akhir ke sisi Frontend.

---

## Database

- Update (re-run push) prisma jika belum ada tabel `TemplateWord` sesuai schema PRD, perhatikan relasi antara soal dengan target output file.
- Pastikan rekam URL/path file yang di-generate.

---

## Acceptance Criteria

- [ ] Bisa upload file template `.docx`.
- [ ] Bisa create dokumen baru berisi daftar soal ke .docx (berdasarkan template yg diupload).
- [ ] Dokumen yg sudah digenerate bisa didownload oleh Frontend.
- [ ] Library python-docx berfungsi untuk membaca dan menulis dokumen.
