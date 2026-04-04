# Pull Request / Hasil Kerja untuk [ISSUE-14] Refine AI Prompting Strategy

**Status execution:** Berhasil
**Changes:**
- **Backend:**
  - `ai_service.py`: Memperbarui `SYSTEM_PROMPT` dengan persona Pendidik Profesional Kurikulum Merdeka.
  - `ai_service.py`: Memperbarui `_build_user_prompt` dengan struktur baru yang menyertakan **Fase/Kelas** dan **Level Kognitif**.
  - `models/soal.py`: Menambahkan field `fase` dan `kelas` ke `GenerateSoalRequest`.
  - `routes/soal.py`: Memperbarui endpoint `/generate` untuk mengambil `kelas` dari database modul dan meneruskan `fase_kelas` ke AI service.
  - `tests/test_ai_service.py`: Menambahkan unit test untuk memverifikasi struktur prompt baru.
- **Frontend:**
  - `types/index.ts`: Memperbarui interface `GenerateSoalRequest` untuk mendukung `fase` dan `kelas`.
  - `pages/GenerateSoal.tsx`: Menambahkan input UI untuk **Fase** dan **Kelas** (opsional) pada konfigurasi parameter.

**Validation:**
- Unit test backend `pytest backend/tests/test_ai_service.py` lulus (9 items).
- Type check frontend `tsc --noEmit` lulus.
- Struktur prompt sekarang lebih terisolasi untuk evaluasi materi siswa, bukan aktivitas guru.

---
**Revision 2 (Revisi Berdasarkan Feedback PR #28 - 5 Critical Bugs):**
1.  **AI Service:** Update prompt untuk Fase A (Kelas 1-2) agar menggunakan kalimat sederhana, kosakata dasar, dan konsep konkret.
2.  **AI Service:** Menegaskan field `gambar_prompt` pada JSON schema agar wajib ada jika `include_gambar` aktif.
3.  **EditSoal.tsx:** Tombol "Simpan Permanen" kini mengupdate status soal menjadi `finalized`.
4.  **EditSoal.tsx:** Perbaikan UI `addSoalItem` sehingga form input Pilihan Ganda (A, B, C, D) langsung muncul saat menambah soal manual.
5.  **CORS/NetworkError:** Mengaktifkan `allow_origins=["*"]` di backend untuk menghindari kegagalan request (CORS) di berbagai port pengujian.

Tolong Senior Agent review kembali perbaikan menyeluruh saya.
