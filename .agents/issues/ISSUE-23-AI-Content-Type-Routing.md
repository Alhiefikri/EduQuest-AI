# [ISSUE-23] AI Content Type Routing & Prompt Optimization

**Status:** Open  
**Assignee:** Junior Execution Agent  
**Prioritas:** High  
**File Utama:** 
- `backend/app/services/ai_service.py`
- `backend/app/models/soal.py`
- `backend/app/routes/soal.py`
- `frontend/src/pages/GenerateSoal.tsx` (Dan service/tipe terkait di frontend)

**Latar Belakang:**  
Terdapat perbedaan signifikan dalam kualitas soal antara provider (Groq vs Qwen/Gemini) ketika input materi berukuran minim atau berupa CP/TP (Capaian/Tujuan Pembelajaran) alih-alih modul ajar utuh. Masalah intinya terletak pada arsitektur yang tidak membedakan "kepadatan informasi" (modul ajar = padat materi, CP/TP = hanya tujuan tanpa materi). Hal ini menyebabkan model Groq membuat soal yang kelewat mudah (konservatif) dan model Qwen cenderung berhalusinasi.

Draf awal telah direview dan saya sebagai Senior Architect sepakat dengan akar masalah, namun ada sedikit perbaikan instruksi agar lebih sesuai dengan struktur yang ada di codebase saat ini (seperti menggunakan `Pydantic` `BaseModel` yang sudah didefinisikan di `app.models.soal.py` dan React/Vite di `frontend`).

---

## Deskripsi High-Level Task

Kita harus membedakan cara agen AI menerima instruksi *berdasarkan jenis materi* (Apakah Modul Ajar, CP/TP, atau Input Manual).
Tugas ini dibagi menjadi 3 sub-task (ISS-07, ISS-08, dan ISS-09).

---

### ISS-07: Deteksi Jenis Input dan Routing Prompt di `ai_service.py`

Karena kita menerima berbagai jenis dokumen/teks, kita harus menentukan prompt mana yang cocok berdasarkan jenisnya.

1. **Definisikan Tipe Konten:**
   Buat konstanta enum `TipeKonten` (`modul_ajar`, `cp_tp`, `input_manual`) di awal modul `ai_service.py`.

2. **Fungsi Deteksi (Fallback):**
   Buat fungsi `_detect_tipe_konten(konten: str)` yang mengecek keyword di dalam konten. Jika string mengandung keyword seperti "tujuan pembelajaran" atau "capaian pembelajaran", tebak sebagai `cp_tp`. Sebaliknya, tebak sebagai `modul_ajar`.

3. **Buat Builder Khusus CP/TP:**
   Buat fungsi `_build_cp_tp_section(konten_cp_tp, mata_pelajaran, topik)` yang mengubah instruksi di prompt agar AI lebih berfokus pada "membuat soal yang menguji tercapainya tujuan" alih-alih mengekstrak informasi dari teks (karena isi teksnya hanyalah tujuan).

4. **Modifikasi `_build_user_prompt`:**
   Tambahkan argumen `tipe_konten: str = "modul_ajar"`. Susun konten bagian `Materi` dengan memanggil `_build_cp_tp_section` jika tipe konten adalah `cp_tp`. Selain itu, tambahkan panduan level kognitif khusus berdasarkan jenis konten (contoh: jangan buat soal definisi jika materi adalah `cp_tp` level analisis). Terapkan hal yang sama ke `_build_regenerate_prompt`.

5. **Update Endpoint Entry Point:**
   Pada fungsi `generate_soal` (dan regenerasi), passing argumen parameter `tipe_konten` ini agar sampai ke dalam prompt builder.

---

### ISS-08: Update FASE_GUIDELINES di `ai_service.py` (Tambahkan Contoh Konkret)

Untuk mencegah AI menggunakan kosakata akademik tingkat tinggi pada anak SD, modifikasi konstan `FASE_GUIDELINES` (Khusus Fase A dan Fase C). Tambahkan kalimat *Contoh BENAR* dan *Contoh SALAH* secara ringkas di dalam value dictionarynya agar model punya patokan gaya bahasa. Jangan ubah key atau aturan awalnya, cukup tambahkan kalimat contohnya.

---

### ISS-09: Integrasi Parameter `tipe_konten` dari Frontend ke Backend

Tugas ini mensyaratkan perubahan lintas-stack karena opsi `tipe_konten` harus terkirim dari UI hingga ke AI Service.

1. **Update Model Backend (`app/models/soal.py`):**
   Pada schema pydantic `GenerateSoalRequest`, tambahkan field baru:
   ```python
   tipe_konten: str = Field("modul_ajar", pattern="^(modul_ajar|cp_tp|input_manual)$")
   ```
   *(Catatan: Jangan lupa lewatkan field ini dari endpoint `routes/soal.py` ke fungsi `generate_soal` di services).*

2. **Update Frontend (`frontend/src/pages/GenerateSoal.tsx` dll):**
   - Tambahkan field `tipe_konten` pada Tipe/Interface request API yang sesuai di frontend.
   - Modifikasi State dan *Form payload* di UI `GenerateSoal.tsx` agar saat user memilih jenis upload (apakah upload modul utuh, input CP/TP, atau ketik materi secara manual), UI menetapkan state `tipe_konten` yang benar untuk dikirimkan ke payload backend saat tombol Generate ditekan.

---

## Acceptance Criteria
- [ ] Berjalan di branch `feature/issue-23`.
- [ ] File `ai_service.py` memiliki tipe konten enum dan builder yang membedakan penanganan antara `modul_ajar` dan `cp_tp`.
- [ ] File `ai_service.py` memiliki contoh konkret dalam `FASE_GUIDELINES`.
- [ ] File schema `backend/app/models/soal.py` menerima parameter string `tipe_konten`.
- [ ] Di sisi frontend (React), properti `tipe_konten` sukses disematkan pada request generate soal saat pengguna memencet tombol Generate.
- [ ] Hasil soal untuk *input berupa CP/TP* menunjukkan peningkatan logika kognitif yang memicu model untuk menyusun soal evaluasi aplikasi, bukan hanya soal hafalan definisi.
- [ ] Jika semua task sudah berjalan baik dan tidak ada error pada linter/typing, commit laporan review di dalam `.agents/reviews/PR-ISSUE-23.md`.

---

**Pesan dari Senior Architect:**
> *Untuk Agen Junior: Ingatlah untuk selalu merujuk pada pattern Typescript/React dan FastAPI/Pydantic yang sudah ada di projek ini. Saat menambahkan komponen tipe konten di frontend, pastikan flow pengiriman API-nya tersambung dengan mulus dari React Query hooks (atau fetch calls) ke dalam payload Pydantic! Jangan mengutak-atik validasi/parser JSON respons AI yang sudah jalan di issue sebelumnya.*