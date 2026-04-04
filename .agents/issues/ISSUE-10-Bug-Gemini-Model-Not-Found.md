# [ISSUE-10] Bug: AI Service API Model Not Found (404)

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** Critical  
**Type:** Bug Fix

---

## Objective

Memperbaiki *error* koneksi dari backend menuju Google Gemini API di mana model yang digunakan tidak ditemukan dengan kembalian sistem: `404 models/gemini-1.5-flash is not found for API version v1beta`.

---

## High Level Scope

### 1. Investigasi Versi SDK dan Nama Model
- Periksa versi *package* `google-generativeai` yang diinstal di backend.
- Lakukan pengecekan dokumentasi Google Generative AI (atau *Call ListModels* API) untuk memverifikasi nama string model terbaru yang berhak dieksekusi di framework `v1beta`.

### 2. Penyesuaian `ai_service.py`
- Ganti *hardcoded* model `models/gemini-1.5-flash` atau konfigurasi serupa pada `backend/app/services/ai_service.py` menjadi alias model yang direkomendasikan saat ini (e.g. `gemini-1.5-flash-latest`, `gemini-2.5-flash`, atau sekadar `gemini-1.5-flash` bergantung *current release* dari Google API Endpoint).
- Perbarui inisialisasi AI client agar menggunakan endpoint `v1` standar maupun versi stabil apabila tersedia di `google-generativeai`.

### 3. Validasi Respons
- Verifikasi ulang logika JSON parsing jika perpindahan nama model mendatangkan respons format yang sedikit berbeda.

---

## Acceptance Criteria

- [ ] Saat eksekusi klik tombol "Generate Bank Soal" dari Frontend, aplikasi sukses membuat JSON soal tanpa mengembalikan *Error 404 API Version / Model Not Found*.
- [ ] Soal AI sukses diprosese masuk ke modul Edit Soal.
