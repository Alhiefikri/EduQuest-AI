# [ISSUE-21] Implement Stepper UI & PDF Page Filtering (Context Optimization)
**Status:** Open
**Assignee:** Junior Execution Agent

## 📌 Deskripsi High-Level & Kritik *Brainstorming.md*
Berdasarkan dokumen `@Brainstorming.md`, ada usulan untuk membuat fitur **Wizard/Stepper**, **Modal PDF Preview**, dan **Single Question Regeneration**.

**Kritik & Evaluasi Arsitektur:**
1. **Single Regeneration:** Sudah kita implementasikan pada Issue sebelumnya (PR #19 dan #38). Tidak perlu dikerjakan ulang.
2. **Library Parsing PDF:** Dokumen mengusulkan `pdfplumber`. **Kritik:** Kita sudah menggunakan `PyMuPDF` (`fitz`) di `parser_service.py` yang jauh lebih cepat, ringan, dan akurat. Jangan install `pdfplumber` agar *bundle* tetap ringan.
3. **Modal PDF Preview (Frontend):** Jangan menginstall package berat seperti `react-pdf`. **Kritik:** Semua browser modern sudah memiliki PDF Viewer bawaan. Cukup gunakan tag HTML native `<iframe src={url_pdf}>` atau `<embed>` untuk menampilkan PDF secara instan dan tanpa membebani *bundle size* React kita.
4. **Context Filtering (Optimasi Performa):** Saat ini kita mengirim SELURUH isi teks PDF ke AI, yang membuat token membengkak dan proses *generate* menjadi lambat. Kita akan membiarkan *user* memilih rentang halaman (misal: "1-5, 8").

## 🎯 Acceptance Criteria (Syarat Selesai)

### 1. Backend: Fungsi Ekstraksi Berdasarkan Halaman & Dukungan CP/ATP
- [ ] Buka `backend/app/services/parser_service.py`. Buat fungsi baru (misal: `extract_text_from_pdf_by_pages`) yang membaca file PDF langsung dari *path* lokalnya (menggunakan `fitz`), lalu **hanya mengekstrak teks pada halaman yang diminta** (berdasarkan *array of page numbers*).
- [ ] Ubah endpoint `POST /api/v1/soal/generate` di `routes/soal.py` agar bisa menerima parameter opsional baru: `page_ranges` (tipe `str`, contoh: `"1-3, 5"`), serta dukungan teks tambahan untuk sumber materi **CP / ATP**. (Dapat digabungkan ke dalam teks `topik` saat dikirim ke AI, atau buat parameter tersendiri).
- [ ] Jika `page_ranges` diisi, backend tidak boleh menggunakan `ModulAjar.kontenTeks` (yang berisi *full text*), melainkan harus membaca ulang file dari disk dan memanggil fungsi *extract* spesifik halaman di atas agar konteks yang dikirim ke AI jauh lebih efisien.

### 2. Frontend: Refaktor `GenerateSoal.tsx` Menjadi 3 Langkah (Stepper)
Ubah UI *form* yang panjang menjadi 3 tahap progresif menggunakan React State sederhana (jangan install *library stepper* tambahan):
- [ ] **Step 1: Sumber Materi (Terdapat 3 Opsi Utama).** 
  1. **Modul Ajar:** Memilih dari *Library* atau Upload PDF baru.
  2. **CP / ATP:** (Capaian Pembelajaran / Alur Tujuan Pembelajaran). Sediakan komponen `<Textarea>` yang rapi agar user bisa *copy-paste* teks CP/ATP.
  3. **Input Topik Manual:** Untuk mendeskripsikan materi umum menggunakan *text input*.
- [ ] **Step 2: Filter Konteks (BARU).** 
  - Jika user memilih sumber **Modul Ajar (PDF)**, tampilkan *preview* dokumen menggunakan `<iframe src={file_url} className="w-full h-[500px]" />`. (Pastikan endpoint backend bisa menyajikan file statis dari folder `uploads/`).
  - Sediakan field input teks: `"Pilih Rentang Halaman (Opsional)"` dengan *placeholder* `"contoh: 1-5, 8"`. Jika dikosongkan, artinya baca seluruh dokumen.
  - Jika user memilih sumber **CP/ATP** atau **Topik Manual**, step ini bisa di- *skip* secara otomatis atau hanya menampilkan rangkuman/preview teksnya.
- [ ] **Step 3: Parameter AI.** Menampilkan pengaturan *Mata Pelajaran*, *Kelas*, *Tipe Soal*, *Jumlah Soal*, *Level*, dan *Gaya Soal*. Tombol "Generate" hanya ada di langkah terakhir ini.

### 3. UI/UX
- [ ] Berikan indikator visual yang jelas untuk setiap "Step" (misal: "Step 1 of 3: Sumber Materi").
- [ ] Berikan tombol "Next" dan "Back" untuk navigasi antar *step*.
- [ ] Pastikan UI di setiap langkah (*step*) terlihat luas, modern, dan tidak terlalu padat. 

Silakan buat *branch* `feature/issue-21` untuk mengeksekusi tugas ini. Prioritaskan performa (Context Filtering) karena ini akan sangat mempercepat proses generasi soal Qwen 3.6 Plus!
