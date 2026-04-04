# Pull Request / Hasil Kerja untuk [ISSUE-13]

**Status execution:** Berhasil
**Branch:** `feature/issue-13`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/26

---

## Changes:

### Backend
- **New Route**: `routes/settings.py` — 3 endpoints (GET/POST `/api/v1/settings/ai`, POST `/api/v1/settings/ai/test`)
- **Config Refactor**: `config.py` — Runtime settings via `data/ai_settings.json`, override `.env` values
- **AI Service Refactor**: `ai_service.py` — Reads config at runtime, accepts `api_key` parameter in generate functions
- **Main**: Include settings router

### Frontend
- **Settings Page**: Complete redesign with "AI Integration" tab
  - Provider dropdown (Gemini / Groq)
  - Password input with show/hide toggle
  - Test Connection button
  - Save button with loading state

## Acceptance Criteria Checklist:
- [x] User bisa memilih provider dan memasukkan API Key dari UI
- [x] Backend langsung menggunakan provider yang dipilih tanpa restart
- [x] API Key tidak terekspos di response frontend (di-mask)

## Security:
- API keys masked: `AIza****xyz1`
- Keys stored in `data/ai_settings.json` (gitignored)
- Password input type with toggle visibility

## TypeScript Check:
```
npx tsc --noEmit → 0 errors
```

## Backend Import Check:
```
All imports OK
```

Tolong Senior Agent review kode saya lewat branch ini.

---

## Commit 2: Review Round 1 Fixes

### 🔴 Critical: Missing `continue` di `_generate_with_groq()` retry loop
- **Masalah:** Setelah `time.sleep(2)` pada non-rate-limit error, tidak ada `continue` — eksekusi jatuh ke bawah loop dan otomatis raise `RuntimeError` tanpa retry
- **Fix:** Tambah `continue` setelah `time.sleep(2)` di `_generate_with_groq()`
- **Files:** `ai_service.py`

### 🟡 Minor: Groq `max_tokens` terlalu tinggi
- **Masalah:** `max_tokens=8192` bisa timeout pada model `llama-3.3-70b-versatile`
- **Fix:** Turunkan ke `4096`
- **Files:** `ai_service.py`

---

## Commit 3: Review Round 2 Fixes

### 🟡 Missing `continue` di `_generate_with_gemini()` retry loop
- **Masalah:** Bug yang sama persis dengan Groq — handler `Exception` terakhir tidak ada `continue`
- **Fix:** Tambah `continue` setelah `time.sleep(2)` di `_generate_with_gemini()`
- **Files:** `ai_service.py`

### 🟡 Settings Tab State Hardcoded
- **Masalah:** Tab "AI Integration" selalu aktif (`i === 2`), tab lain tidak bisa diklik
- **Fix:** Tambah `activeTab` state, semua tab sekarang clickable dengan `onClick={() => setActiveTab(i)}`
- **Files:** `Settings.tsx`

### Test Results:
```
npx tsc --noEmit → 0 errors
All imports OK
```
