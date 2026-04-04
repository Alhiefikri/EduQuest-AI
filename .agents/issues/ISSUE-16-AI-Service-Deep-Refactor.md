# [ISSUE-16] Deep Refactor: AI Service Quality & Async Architecture

**Status:** Review  
**Assignee:** Execution Agent  
**Priority:** High  
**Type:** Refactor / Bug Fix

---

## Objective
Meningkatkan kualitas output soal AI agar kontekstual untuk siswa (bukan guru), memperbaiki arsitektur async yang saat ini memblokir event loop, dan mengoptimalkan penggunaan token.

## Scope of Work

### A. Fix Blocking Async (Kritis)
Saat ini `_generate_with_groq` dan `_generate_with_gemini` menggunakan `time.sleep()` dan client sinkronus di dalam environment async FastAPI. Ini memblokir seluruh server.

**Yang harus dilakukan:**
- Ganti library `groq` dengan **`AsyncGroq`** (dari package `groq` yang sama, sudah tersedia).
- Ganti semua `time.sleep()` menjadi `await asyncio.sleep()`.
- Jadikan `_generate_with_groq` dan `_generate_with_gemini` menjadi `async def`.
- Untuk Gemini, gunakan `client.aio.models.generate_content()` (async method bawaan `google-genai`).
- **Selalu gunakan `context7` untuk cek dokumentasi terbaru `groq` dan `google-genai` Python SDK.**

### B. Perkuat Prompt Engineering
Tambahkan di `_build_user_prompt()`:
1. **Negative Prompt Tegas:** Tambahkan instruksi eksplisit:
   > "DILARANG KERAS membuat soal tentang kegiatan belajar di kelas, metode mengajar guru, langkah-langkah pembelajaran, atau alat peraga. Fokus HANYA pada materi/fakta yang harus dikuasai siswa."
2. **Contextual Storytelling:** Tambahkan instruksi agar soal dibungkus skenario sehari-hari yang relevan dengan usia siswa (misal: bermain di taman, belanja di kantin, membantu ibu).
3. **Dynamic JSON Schema:** Jangan paksa field `pembahasan` dan `gambar_prompt` muncul di template JSON jika `include_pembahasan=False` atau `include_gambar=False`. Ini menghemat token output.

### C. Optimasi Truncation
Fungsi `_truncate_content()` saat ini memotong dari awal dokumen (yang biasanya berisi cover/pengantar, bukan inti materi).

**Yang harus dilakukan:**
- Tambahkan komentar `# TODO: Implementasi ekstraksi PDF berdasarkan rentang halaman di layer controller`.
- Untuk sekarang, tetap pertahankan fungsi ini tapi turunkan batas menjadi **~3000 kata** (sekitar 8000 karakter) agar lebih fokus dan tidak melebihi context window model kecil.

## Ketentuan Teknis
- **Package:** `groq` (sudah terinstal, gunakan `AsyncGroq`), `google-genai` (sudah terinstal, gunakan `client.aio`).
- **Jangan hapus fitur Modul Ajar.** Tetap pertahankan. Masalahnya bukan di sumber data, tapi di kekuatan prompt.
- **Selalu gunakan `context7` untuk dokumentasi terbaru library.**

## Acceptance Criteria
- [ ] `_generate_with_groq` dan `_generate_with_gemini` berjalan secara **fully async** (tidak ada `time.sleep`).
- [ ] Prompt memiliki negative instruction tegas yang mencegah halusinasi "kegiatan kelas".
- [ ] Prompt memiliki instruksi storytelling/skenario sehari-hari.
- [ ] JSON schema output bersifat dinamis (field opsional tidak dipaksa muncul).
- [ ] Batas truncation diturunkan dan ada TODO comment untuk future improvement.
