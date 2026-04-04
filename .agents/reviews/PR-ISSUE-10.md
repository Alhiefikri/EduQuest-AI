# Pull Request / Hasil Kerja untuk [ISSUE-10]

**Status execution:** Berhasil
**Branch:** `feature/issue-10`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/20

---

## Changes:
- Mengganti nama model Gemini dari `gemini-1.5-flash` menjadi `gemini-1.5-flash-latest` di `backend/app/services/ai_service.py`

## Acceptance Criteria Checklist:
- [x] Soal bisa di-generate ulang dari frontend tanpa mengembalikan 404 Model Not Found

## Root Cause:
Google Gemini API v1beta sudah mendeprecate model string `gemini-1.5-flash`. SDK `google-generativeai==0.8.2` sekarang memerlukan suffix `-latest` untuk resolve model dengan benar. Error yang muncul: `404 models/gemini-1.5-flash is not found for API version v1beta`.

## Fix:
```diff
- model_name="gemini-1.5-flash",
+ model_name="gemini-1.5-flash-latest",
```

## File yang diubah:
- `backend/app/services/ai_service.py` — 1 baris berubah

Tolong Senior Agent review kode saya lewat branch ini.
