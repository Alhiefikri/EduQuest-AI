# [ISSUE-07] Frontend Soal Management & README Finalization

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** High  
**Ref:** `PRD.md` Section 4.2 (F2, F3, F4)

---

## Objective

Menyelesaikan siklus utama EduQuest AI, yaitu integrasi Frontend untuk menghasilkan soal (Generate), menyunting soal (Edit), serta mengekspor soal (Word Export). Selain itu, proyek membutuhkan panduan instalasi yang jelas di dalam `README.md`.

---

## High Level Scope

### 1. Form Generate Soal
- Sambungkan form "Buat Soal" agar dapat mengirimkan parameter beserta ID Modul ke service Gemini Backend (`/api/v1/soal/generate`).
- Berikan indikator visual (*loading state*) yang mumpuni saat AI memproses request.

### 2. View & Edit Soal
- Aktifkan halaman "Daftar Soal" untuk memunculkan riwayat soal yang telah dibuat.
- Sambungkan halaman "Detail/Edit Soal" agar pengguna dapat meninjau dan mengubah teks JSON soal (pertanyaan, jawaban, dll.) secara langsung sebelum di-render ke Word.

### 3. Ekspor Dokumen Word
- Tambahkan integrasi API pada tombol Ekspor / Preview, yang akan me-request Backend Service untuk membuat dokumen kustom.
- Handle file blob yang diberikan sehingga browser pengguna memproses download secara spesifik sebagai file `.docx`.

### 4. Dokumentasi Instalasi
- Perbarui file `README.md` utama.
- Tulis instruksi langkah-demi-langkah cara menyiapkan *environment* (requirements.txt / npm install), mengatur kredensial (API Key / Database), serta perintah standar untuk *running* server Backend (FastAPI / Uvicorn) dan server Frontend (Vite).

---

## Acceptance Criteria

- [ ] Fungsi "Generate" mengembalikan output ke layar user tanpa error.
- [ ] User berhasil mengedit dan menyimpan soal menggunakan antarmuka interaktif yang dipasangkan ke endpoint Update Soal.
- [ ] Fitur download .docx berfungsi, memicu popup unduh di browser.
- [ ] File `README.md` ter-update dengan dokumentasi lokal yang dapat dimengerti oleh developer mana pun untuk mencoba menjalankan aplikasi ini.
