### 📝 Senior Developer Code Review - PR #40 (OpenRouter Integration)

Halo Junior! Saya sudah melihat implementasi integrasi OpenRouter menggunakan model `qwen/qwen-3.6-plus:free`. Secara fungsional dan modifikasi pada UI *Settings* sudah cukup baik.

Namun, saat *user* (atau *reviewer*) menarik *branch* ini dan menjalankan server, aplikasi langsung **CRASH** (*Fatal Error*) pada saat *startup* Uvicorn dengan pesan:
`ModuleNotFoundError: No module named 'openai'`

Selain itu, berdasarkan dokumentasi resmi OpenRouter, ada sedikit kekeliruan pada format *Header* yang kamu kirim. Berikut adalah detail perbaikan yang harus segera kamu lakukan:

#### ❌ 1. Konsistensi Arsitektur & Lazy Import (CRITICAL)
Di `backend/app/services/ai_service.py`, kamu meletakkan `from openai import AsyncOpenAI` di bagian paling atas file (Global Scope). 
**Masalah:** Ini melanggar pola (*pattern*) yang sudah ada. Jika kamu melihat fungsi `_generate_with_gemini` dan `_generate_with_groq`, *import library* spesifik dilakukan di **dalam fungsinya masing-masing (Lazy Import)**. Hal ini disengaja agar *FastAPI* tidak langsung mati/crash saat *startup* jika kebetulan *user* belum menjalankan `pip install -r requirements.txt`.
**Perbaikan:** Pindahkan `from openai import AsyncOpenAI` ke dalam fungsi `_generate_with_openrouter`.

#### ⚠️ 2. Kesalahan Format Header OpenRouter (Documentation Check)
Berdasarkan referensi dokumentasi murni dari OpenRouter API, *header* opsional untuk identifikasi aplikasi di *ranking* OpenRouter adalah `X-OpenRouter-Title`, bukan `X-Title`.
**Perbaikan:** Di dalam fungsi `_generate_with_openrouter`, pada parameter `extra_headers`, ubah strukturnya menjadi persis seperti ini:
```python
extra_headers={
    "HTTP-Referer": "https://github.com/Alhiefikri/EduQuest-AI",
    "X-OpenRouter-Title": "EduQuest AI",
}
```

#### 💡 Saran Tambahan (Frontend - Settings.tsx)
Kode evaluasi `apiKey` di fungsi `handleTestConnection` pada file `Settings.tsx`:
```typescript
let apiKey = ''
if (aiProvider === 'groq') apiKey = groqKey
else if (aiProvider === 'openrouter') apiKey = openrouterKey
else apiKey = geminiKey
```
Kode di atas sudah benar, tapi untuk penerapan DRY dan keterbacaan yang lebih modern, kamu bisa menggunakan *Object Mapping* sederhana:
```typescript
const keys: Record<string, string> = { groq: groqKey, openrouter: openrouterKey, gemini: geminiKey };
const apiKey = keys[aiProvider] || geminiKey;
```
*(Saran frontend ini opsional, tapi sangat dianjurkan untuk Clean Code).*

---
**Status:** **Changes Requested** 🟡
Tolong kerjakan revisi nomor 1 dan 2 agar aplikasi tidak *crash*, lalu *push commit* tambahan ke *branch* ini. Semangat!🚀