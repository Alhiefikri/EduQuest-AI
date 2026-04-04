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
**Revision (Revisi Berdasarkan Feedback PR #28):**
- Menajamkan logika penggabungan `fase_kelas` di `routes/soal.py` agar lebih eksplisit (`if/elif` block).
- Memastikan `GenerateSoalRequest` di `models/soal.py` sinkron dengan frontend untuk menghindari error 422.
- Melakukan *push* ulang ke branch `feature/issue-14`.

Tolong Senior Agent review kembali perbaikan saya.
