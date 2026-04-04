# [ISSUE-12] Fix AI Free Tier & Multi-Provider AI Support

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** Critical  
**Type:** Bug Fix + Enhancement

---

## Objective

Dua tujuan utama sprint ini:
1. **Fix segera:** Ganti model `gemini-2.0-flash` ke model Gemini yang tersedia di **Free Tier**.
2. **Enhancement:** Tambahkan dukungan multi-provider AI (Groq) sebagai alternatif selain Google Gemini, agar user tidak terkunci pada satu layanan.

---

## Bug Fix: Model Gemini Tidak Tersedia di Free Tier

**Error:** `429 RESOURCE_EXHAUSTED — limit: 0, model: gemini-2.0-flash`

**Root Cause:** Model `gemini-2.0-flash` **tidak tersedia di Free Tier** (kuota = 0). Model yang benar untuk Free Tier adalah **`gemini-1.5-flash`**.

**Fix Segera di `backend/app/services/ai_service.py`:**
```python
# Ganti dari:
model="gemini-2.0-flash"

# Menjadi:
model="gemini-1.5-flash"
```

**Penting:** Gunakan nama model tanpa suffix `-latest` karena SDK `google-genai` sudah meng-handle resolusi versi secara internal.

---

## Enhancement: Multi-Provider AI Support

Tambahkan dukungan provider AI alternatif yang **100% gratis** yaitu **Groq** (menyediakan model LLaMA-3, Mixtral, dll secara gratis dengan rate limit yang generous).

### Ruang Lingkup Perubahan

**1. Konfigurasi (`backend/app/config.py`):**
- Tambahkan variabel `AI_PROVIDER` (nilai: `gemini` atau `groq`)
- Tambahkan variabel `GROQ_API_KEY`

**2. Refactor `ai_service.py`:**
- Buat fungsi terpisah `_generate_with_gemini()` dan `_generate_with_groq()`
- Fungsi `generate_soal()` utama membaca konfigurasi `AI_PROVIDER` untuk memilih provider yang aktif
- **Groq API** menggunakan OpenAI-compatible API:
  ```python
  from groq import Groq
  client = Groq(api_key=GROQ_API_KEY)
  response = client.chat.completions.create(
      model="llama-3.3-70b-versatile",  # Model Groq yang gratis
      messages=[
          {"role": "system", "content": SYSTEM_PROMPT},
          {"role": "user", "content": prompt}
      ],
      temperature=0.7,
      max_tokens=8192,
  )
  ```

**3. Update `backend/requirements.txt`:**
- Tambahkan `groq` package

**4. Update `.env.example`:**
- Tambahkan contoh `AI_PROVIDER=gemini` dan `GROQ_API_KEY=your_key_here`

---

## Acceptance Criteria

- [ ] Generate bank soal dari Frontend berhasil tanpa error 429 (menggunakan `gemini-1.5-flash` via Google Free Tier).
- [ ] `AI_PROVIDER=groq` di `.env` berhasil mengalihkan semua request generate soal ke Groq API.
- [ ] Tidak ada breaking changes — penggunaan `AI_PROVIDER=gemini` (default) tetap berfungsi normal.

---

## Referensi SDK

**Groq Python:** `pip install groq`  
**Free models:** `llama-3.3-70b-versatile`, `llama3-8b-8192`, `mixtral-8x7b-32768`
