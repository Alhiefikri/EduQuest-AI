# Pull Request / Hasil Kerja untuk [ISSUE-17] Feature: Single Question Regeneration with User Feedback (Github Issue #33)

**Status execution:** Berhasil
**Changes:**
- **Backend (Models):** Menambahkan skema `RegenerateSingleSoalRequest` di `models/soal.py` untuk menerima `nomor_soal` dan instruksi `feedback` opsional.
- **Backend (AI Service):** Membuat fungsi baru `regenerate_single_soal()` di `ai_service.py`. Prompt telah disesuaikan agar AI menghasilkan *1 soal BARU yang BERBEDA dari soal lama*, sambil tetap mengikuti instruksi *Negative Prompt* dan *Contextual Storytelling* dari materi asal. Feedback user (jika ada) ditambahkan sebagai "Instruksi Khusus dari Guru".
- **Backend (Routes):** Membuat endpoint `POST /api/v1/soal/{soal_id}/regenerate`. Route ini akan menarik materi dari dokumen sumber (jika ada), menjalankan AI untuk menghasilkan 1 item soal pengganti, lalu mengembalikan objek soal tersebut ke frontend.
- **Frontend (Types & Hooks):** Meng-update `frontend/src/types/index.ts` dengan interface baru dan menambah hook `useRegenerateSingleSoal` di `useSoal.ts`. Menambahkan API call di `services/soal.ts`.
- **Frontend (EditSoal UI):**
  - Menambahkan tombol "🔄 Regenerate" di setiap header kartu butir soal.
  - Membangun Modal dialog yang menampilkan `Textarea` untuk *feedback user* opsional.
  - Saat tombol "Generate Ulang" di-klik di dalam modal, sistem akan menampilkan animasi *loading* (secara spesifik di modal) sambil menunggu backend.
  - Mengupdate state `editedSoal` pada index yang tepat (replace 1 soal), bukan seluruh list, sehingga tidak merusak data yang lain. Modal akan tertutup setelah regenerasi sukses.

Tolong Senior Agent review fungsionalitas dan UX regenerasi tunggal ini.