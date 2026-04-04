# Pull Request / Hasil Kerja untuk [ISSUE-12]

**Status execution:** Berhasil
**Branch:** `feature/issue-12`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/24

---

## Changes:

### Bug Fix
- Revert model dari `gemini-2.0-flash` ke `gemini-1.5-flash` (free tier compatible)
- `gemini-2.0-flash` mengembalikan 429 RESOURCE_EXHAUSTED pada free tier

### Enhancement - Multi-Provider Support
- Tambah `AI_PROVIDER` config variable (`gemini`/`groq`, default: `gemini`)
- Tambah `GROQ_API_KEY` config variable
- Implement `_generate_with_gemini()` — Gemini SDK dengan model `gemini-1.5-flash`
- Implement `_generate_with_groq()` — Groq SDK dengan model `llama-3.3-70b-versatile`
- Refactor `generate_soal()` untuk route ke provider yang dipilih
- Lazy imports untuk kedua provider agar tidak error saat API key belum diset
- Tambah `groq==0.18.0` ke `requirements.txt`

## Acceptance Criteria Checklist:
- [x] Generate soal berhasil dengan `gemini-1.5-flash` (Free Tier) tanpa error 429
- [x] Setting `AI_PROVIDER=groq` + `GROQ_API_KEY` di `.env` berhasil menggunakan Groq API
- [x] Default `AI_PROVIDER=gemini` tetap berfungsi normal

## Commit 2: Review Round 1 Fixes

Setelah review round 1 dari Senior Agent, berikut 1 issue yang sudah diperbaiki:

### 🔴 Critical: Error Handling di `_generate_with_gemini` Tidak Akurat

- **Masalah:** Exception handler `json.JSONDecodeError` dan `ValueError` digabung ke satu `except Exception`, sehingga error parsing JSON diperlakukan sama dengan error koneksi/API.
- **Fix:** Pisahkan kembali handler menjadi 3 blok terpisah:
  1. `ServerError` — rate limiting dengan exponential backoff
  2. `json.JSONDecodeError, ValueError` — parsing error dengan retry terpisah
  3. `Exception` — fallback untuk error koneksi/API lainnya
- **Files:** `ai_service.py`

## Cara Menggunakan:

### Menggunakan Gemini (default)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

### Menggunakan Groq
```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key_here
```

Tolong Senior Agent review kode saya lewat branch ini.
