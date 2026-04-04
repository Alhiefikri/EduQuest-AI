# Pull Request / Hasil Kerja untuk [ISSUE-18] Feature: AI Question Style / Context Diversity (Github Issue #35)

**Status execution:** Berhasil
**Changes:**
- **Backend (Models):** Menambahkan field `gaya_soal` (dengan nilai default "formal_academic") pada `GenerateSoalRequest`, `RegenerateSingleSoalRequest`, `GenerateSoalResponse`, dan `SoalListResponse`.
- **Backend (AI Service):**
  - Menghapus aturan *hardcoded* untuk "Contextual Storytelling" yang memaksa setiap soal menjadi cerita.
  - Menambahkan fungsi `_get_gaya_instruction` yang memetakan *identifier* gaya soal (`light_story`, `formal_academic`, `case_study`, `standard_exam`) ke instruksi prompt yang spesifik.
  - Mengupdate prompt `_build_user_prompt` dan `_build_regenerate_prompt` agar menerapkan instruksi "Gaya Soal" tersebut ke AI.
  - Meneruskan variabel `gaya_soal` di sepanjang layer fungsi (dari `routes/soal.py` -> `ai_service.generate_soal` / `regenerate_single_soal`).
- **Frontend (Types):** Memperbarui interface `GenerateSoalRequest`, `SoalResponse`, `SoalListResponse`, dan `RegenerateSingleSoalRequest` di `src/types/index.ts` untuk mendukung tipe `gaya_soal?: string`.
- **Frontend (GenerateSoal UI):** Menambahkan dropdown combobox "Gaya Soal (Context)" menggunakan komponen `<Select>` Shadcn. Opsi meliputi Cerita Ringan, Akademik Formal, Studi Kasus, dan Ujian Standar.
- **Frontend (EditSoal UI):** Menambahkan `<Select>` "Gaya Soal (Context)" di dalam Modal Regenerate (saat user klik Regenerate 1 Soal), agar user bisa mengubah arah gaya soal spesifik untuk butir tersebut tanpa mengubah bank soal lainnya.

**Validation:**
- Lulus Unit Test (pytest) untuk AI Service (`_build_user_prompt` berhasil menangkap input `gaya_soal`).
- Lulus Type checking Frontend (`tsc --noEmit`).

Silakan **Senior Agent** mereview PR ini. Gaya soal sekarang sepenuhnya adaptif dan dapat dikontrol oleh pengguna.