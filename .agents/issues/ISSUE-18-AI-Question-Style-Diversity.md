# [ISSUE-18] Feature: AI Question Style / Context Diversity

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** Medium  
**Type:** Enhancement

---

## Objective
Saat ini AI secara konstan (*hardcoded*) mengaplikasikan gaya "Contextual Storytelling" di seluruh generasi soal. User merasa soal kurang beragam karena semua dikonversi menjadi soal cerita. Tujuan tiket ini adalah memberikan kontrol dinamis ("Gaya / Konteks Soal") kepada guru untuk memilih pendekatan soal yang diinginkan, sehingga dihasilkan variasi bentuk soal (contoh: Akademis formal, Simulasi studi kasus, atau soal cerita ringan).

---

## Scope of Work

### 1. Backend Pydantic Schemas (`app/models/soal.py`)
- Tambahkan properti `gaya_soal: str` pada `GenerateSoalRequest` dan `RegenerateSingleSoalRequest`.
- Berikan default value (misal: `"akademik"`) dan buat enum/regex validasinya.

### 2. Backend AI Prompting (`app/services/ai_service.py`)
- Modifikasi fungsi `_build_user_prompt` dan `_build_regenerate_prompt`.
- Hapus *hardcoded* "Contextual Storytelling" pada poin instruksi nomor 3.
- Buat *mapping instructions* berdasarkan parameter `gaya_soal`:
  - `cerita`: "Bungkus setiap soal dalam skenario atau cerita pendek sehari-hari yang relevan dengan usia siswa."
  - `akademik`: "Gunakan bahasa akademis formal yang to-the-point dan langsung menguji konsep tanpa skenario."
  - `studi_kasus`: "Berikan sebuah situasi kompleks atau masalah hipotetis untuk dianalisis oleh siswa."
  - `ujian_standar`: "Gunakan format dan diksi kaku yang lazim ditemui pada ujian nasional atau ujian standar."

### 3. Frontend Generate Form (`frontend/src/pages/GenerateSoal.tsx`)
- Tambahkan Combobox/Select untuk opsi **Gaya / Pendekatan Soal**.
- Ikat dengan *state* `gayaSoal` dan integrasikan ke *request body* saat memanggil mutasi `generateMutation`.

### 4. Frontend Regenerate Modal (`frontend/src/pages/EditSoal.tsx`)
- Pada UI modal "Regenerate Soal", tambahkan opsi dropdown singkat agar guru bisa memilih gaya saat merombak ulang 1 soal spesifik (misal, sebelumnya akademik tapi dirasa terlalu kaku, bisa di-regenerate ke gaya "cerita").

---

## Acceptance Criteria
- [ ] Pengguna bisa melihat dan memilih opsi Gaya Soal (minimal 4 macam) di form Generate Soal.
- [ ] Opsi gaya soal berhasil terkirim via API dan dibaca backend.
- [ ] Prompt AI berhasil beralih secara dinamis berdasarkan parameter `gaya_soal`.
- [ ] Hasil generasi soal (baik batch maupun regenerasi item tunggal) secara jelas merepresentasikan gaya yang diminta pengguna.

## Panduan Eksekusi untuk Agent Junior
- *File penting backend*: `models/soal.py`, `routes/soal.py`, `services/ai_service.py`.
- *File penting frontend*: `hooks/useSoal.ts`, `types/index.ts`, `pages/GenerateSoal.tsx`, `pages/EditSoal.tsx`.
- Desain dropdown di React cukup tiru Select/Combobox `Tingkat Kesulitan` yang sudah ada menggunakan Shadcn UI.
