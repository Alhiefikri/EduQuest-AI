# [ISSUE-24] Fix: Penegakan Level Kognitif Bloom Tidak Konsisten pada Output Soal

**Status:** Open  
**Assignee:** Junior Execution Agent  
**Prioritas:** High 🔴  
**Tipe:** Bug Fix + Prompt Engineering  
**Estimasi Effort:** S (setengah hari kerja)  
**File yang Terdampak:** `backend/app/services/ai_service.py`

---

## Deskripsi High-Level

Terdapat bug kritis pada engine generasi soal: ketika guru memilih level kognitif Bloom tertentu (misalnya C2–C6), model AI secara konsisten menghasilkan soal pada level C1 (recall/mengingat) yang tidak dipilih sama sekali. Ini adalah **kegagalan fungsional nyata** yang telah diverifikasi dari audit manual 20 soal — 8 di antaranya adalah C1 meskipun C1 tidak dipilih.

Masalah ini berdampak langsung pada kegunaan produk: guru tidak bisa mempercayai bahwa output AI sesuai dengan parameter yang mereka pilih.

---

## Root Cause (Telah Terdiagnosis)

Ada dua penyebab yang bekerja bersamaan dan harus diperbaiki bersama:

### Penyebab 1 — `_get_bloom_instruction()` tidak punya larangan eksplisit

Fungsi saat ini hanya menyebutkan level yang *boleh* dibuat, tanpa pernah melarang level yang tidak dipilih. Model Large Language Model (LLM) — terutama yang berukuran kecil-menengah seperti Gemini 2.5 Flash Lite — memiliki kecenderungan kuat untuk **fallback ke soal C1 (recall)** karena itu adalah jalur termudah untuk memenuhi kuota soal. Tanpa larangan eksplisit, instruksi "buat C2-C6" dibaca model sebagai **preferensi, bukan kewajiban**.

### Penyebab 2 — Posisi `bloom_instruction` di prompt tertimbun

Di `_build_user_prompt()` saat ini, `bloom_instruction` berada di posisi ke-4, **di tengah-tengah** instruksi lain. Riset tentang LLM menunjukkan efek primacy & recency: instruksi di tengah prompt mendapat bobot lebih rendah, terutama untuk model yang lebih kecil.

---

## Acceptance Criteria (Syarat Selesai)

- [ ] Fungsi `_get_bloom_instruction()` diubah total: mencantumkan level yang WAJIB, **dan secara eksplisit melarang level yang tidak dipilih beserta pola kalimatnya** (khususnya jika C1 tidak dipilih)
- [ ] Parameter `jumlah_soal` ditambahkan ke `_get_bloom_instruction()` agar panduan distribusi soal per level akurat (tidak hardcode `20`)
- [ ] Posisi `bloom_instruction` di `_build_user_prompt()` dipindahkan ke **segera setelah `fase_detail`**, sebelum instruksi gaya
- [ ] Perubahan posisi yang sama diterapkan pada `_build_regenerate_prompt()`
- [ ] Semua pemanggilan `_get_bloom_instruction()` diperbarui untuk menyertakan `jumlah_soal`
- [ ] Manual testing Test Case 1–5 (lihat bagian Testing) dilakukan dan hasilnya didokumentasikan di PR review

---

## Spesifikasi Teknis

### Fix 1 — Rewrite `_get_bloom_instruction()`

Ganti seluruh fungsi `_get_bloom_instruction()` dengan implementasi baru yang:
1. Membangun daftar level yang **WAJIB** dibuat (secara eksplisit dan terformat)
2. Membangun daftar level yang **DILARANG** (level yang tidak dipilih)
3. Jika C1 tidak dipilih: menambahkan larangan pola kalimat spesifik C1 (seperti "Apa yang dimaksud dengan...", "Sebutkan...", "Manakah yang termasuk...")
4. Menyertakan panduan distribusi merata berdasarkan `jumlah_soal` aktual
5. Membungkus seluruh instruksi dalam separator `--- LEVEL KOGNITIF WAJIB ---` agar model dapat "melihat" ini sebagai blok instruksi yang berdiri sendiri

Signature baru:
```python
def _get_bloom_instruction(
    bloom_levels: List[str],
    jumlah_soal: int = 20,  # ← parameter baru
) -> str:
```

### Fix 2 — Pindahkan posisi `bloom_instruction` di prompt

Di `_build_user_prompt()`, ubah urutan prompt sehingga `bloom_instruction` muncul **segera setelah `fase_detail`** dan **sebelum** instruksi gaya dan kesulitan.

Hal yang sama harus diterapkan di `_build_regenerate_prompt()`.

---

## Instruksi Tambahan untuk Junior

1. **Fix 1 dan Fix 2 WAJIB dikerjakan dalam satu commit** — Fix 1 saja tanpa Fix 2 tidak optimal karena instruksi tetap "tersembunyi" di tengah prompt.
2. **Jangan ubah `Fix 3` (validasi heuristic)** — ini out of scope untuk issue ini, pisahkan ke issue terpisah jika diperlukan.
3. **Constant `20` di kalkulasi distribusi harus diganti** dengan `jumlah_soal` yang diterima sebagai parameter baru — **jangan biarkan hardcoded**.
4. Perubahan pada `_build_regenerate_prompt()` **wajib** — jangan hanya update `_build_user_prompt()`.

---

## Manual Testing yang Wajib Dilakukan

### Test Case 1 — C1 tidak boleh muncul jika tidak dipilih
- Input: CP/ATP ekosistem, pilih C2+C3+C4+C5+C6, generate 20 soal
- Expected: 0 soal C1, distribusi ~4 soal per level
- Pass: tidak ada soal dengan pola "Apa yang dimaksud", "Sebutkan", atau jawaban recall langsung

### Test Case 2 — C6 harus muncul
- Input: CP/ATP dengan TP level C6, pilih C5+C6, generate 10 soal
- Expected: minimal 3 dari 10 soal adalah C6 (rancang/susun/usulkan)

### Test Case 3 — Backward compat: bloom kosong
- Input: `bloom_levels = []` atau `None`
- Expected: `_get_bloom_instruction()` return string kosong, tidak ada error, soal tetap terbuat

### Test Case 4 — Distribusi merata
- Input: pilih semua C1–C6, generate 20 soal
- Expected: tidak ada level yang mendapat 0 soal atau mendominasi (>8 soal)

---

## Catatan Arsitektur

Fix ini **tidak mengubah kontrak API** (`generate_soal()` dan `regenerate_single_soal()`) — perubahan hanya di internal fungsi helper `_get_bloom_instruction()` dan susunan string prompt. Tidak diperlukan migrasi database.
