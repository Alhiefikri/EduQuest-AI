# Pull Request / Hasil Kerja untuk [ISSUE-04]

**Status execution:** Berhasil
**Branch:** `feature/issue-04`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/8

---

## Changes:
- Membuat `services/ai_service.py` — integrasi Google Gemini API dengan prompt engineering sesuai PRD Section 7
- Membuat `models/soal.py` — Pydantic v2 schemas (GenerateSoalRequest, GenerateSoalResponse, SoalListResponse, UpdateSoalRequest)
- Membuat `routes/soal.py` — 5 endpoints CRUD untuk soal
- Update `config.py` — menambah `GEMINI_API_KEY`
- Update `main.py` — include router soal
- Membuat `tests/test_ai_service.py` — 7 unit test untuk parsing respons AI
- Install dependency `google-generativeai==0.8.2` (sudah ada di requirements.txt)

## Acceptance Criteria Checklist:
- [x] Endpoint generate menerima konfigurasi soal dan return soal dalam format JSON
- [x] AI generate soal yang relevan dengan konten modul (bukan general knowledge)
- [x] Support tipe soal: pilihan ganda, isian, essay
- [x] Support tingkat kesulitan: mudah, sedang, sulit
- [x] Hasil generate tersimpan ke database
- [x] CRUD endpoints untuk soal berfungsi dengan benar
- [x] Error handling untuk API rate limit dan response error
- [x] Unit test untuk AI service logic (7 tests)

## API Endpoints yang tersedia:
```
POST   /api/v1/soal/generate        → Generate soal dari modul/manual
GET    /api/v1/soal?skip=0&limit=20 → List soal (paginated)
GET    /api/v1/soal/{id}            → Detail soal + data JSON lengkap
PUT    /api/v1/soal/{id}            → Update soal (edit, ubah status)
DELETE /api/v1/soal/{id}            → Hapus soal
```

## Fitur Utama:

### Prompt Engineering
- System prompt: AI berperan sebagai guru berpengalaman
- User prompt: Dinamis berdasarkan konfigurasi (tipe soal, kesulitan, modul)
- Output: JSON terstruktur dengan field nomor, pertanyaan, pilihan, jawaban, pembahasan, gambar_prompt

### Rate Limiting
- Gemini free tier: 15 RPM (requests per minute)
- Implementasi retry dengan exponential backoff (2^attempt detik)
- Maksimal 3 percobaan sebelum raise error

### Response Parsing
- Handle JSON murni
- Handle JSON dalam markdown code block (```json ... ```)
- Handle JSON dalam backticks biasa (``` ... ```)
- Handle format array langsung
- Validasi format tidak dikenal → raise ValueError

### Generate Mode
- **Dari modul**: Ambil konten dari ModulAjar di database, AI generate berdasarkan konten
- **Manual**: Tanpa modul, AI generate berdasarkan mata pelajaran + topik yang diinput

## Cara Menjalankan:
```bash
# Pastikan GEMINI_API_KEY sudah diset di .env
source backend/venv/bin/activate
uvicorn app.main:app --reload --app-dir backend
```

## Test Results:
```
17 passed, 5 warnings in 0.98s
```
(10 parser tests + 7 AI service tests)

Tolong Senior Agent review kode saya lewat branch ini.

---

## Commit 2: Review Round 1 Fixes

Setelah review round 1 dari Senior Agent, berikut 2 issue yang sudah diperbaiki:

### 🔴 Critical: Retry Mechanism untuk JSON Parse Error

- **Masalah:** Mekanisme `max_retries = 3` hanya bekerja untuk `ResourceExhausted`. Jika AI berhalusinasi dan menghasilkan JSON yang tidak valid (`JSONDecodeError`) atau format salah (`ValueError`), kode langsung raise error pada percobaan pertama tanpa retry.
- **Fix:** Gabungkan `json.JSONDecodeError` dan `ValueError` ke dalam retry loop. AI yang menghasilkan JSON cacat sekarang akan di-retry hingga 3 kali sebelum raise error final.
- **Files:** `services/ai_service.py`

### 🟡 Important: Inline Import di `models/soal.py`

- **Masalah:** `import json` ada di dalam function body `from_prisma()` — anti-pattern
- **Fix:** Pindah ke top-level import di bagian atas file
- **Files:** `models/soal.py`

### Bonus: Hapus Unused Import

- Hapus `import os` yang tidak terpakai di `ai_service.py`

### Test Results (masih 17/17 passing):

```
17 passed, 5 warnings in 0.66s
```
