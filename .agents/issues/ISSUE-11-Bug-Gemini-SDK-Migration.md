# [ISSUE-11] Bug: Migrasi SDK Google GenAI ke Versi Terbaru

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** Critical  
**Type:** Bug Fix / Dependency Upgrade

---

## Objective

Memperbaiki error `404 models/gemini-1.5-flash-latest is not found for API version v1beta` dengan melakukan migrasi library AI dari `google-generativeai` (deprecated) ke SDK generasi terbaru `google-genai`.

---

## Root Cause

Berdasarkan pengecekan dokumentasi resmi Google:
- Library **`google-generativeai`** yang saat ini terinstal sudah **tidak aktif dikembangkan (deprecated)**.
- SDK yang baru dan resmi didukung adalah **`google-genai`** (`pip install google-genai`).
- API-nya berbeda: menggunakan pola **`client.models.generate_content()`**, bukan `genai.GenerativeModel()` seperti yang saat ini ada di kode.
- Nama model valid yang terbaru adalah **`gemini-2.5-flash`** (bukan `gemini-1.5-flash-latest`).

---

## High Level Scope

### 1. Update Dependency
- Hapus `google-generativeai` dari `backend/requirements.txt`.
- Tambahkan `google-genai` sebagai gantinya.

### 2. Refactor `ai_service.py`
- Ganti inisiasi dengan pola `client = genai.Client(api_key=...)` (bukan `genai.configure(api_key=...)`).
- Ganti `genai.GenerativeModel(model_name=...)` dengan `client.models.generate_content(model=...)`.
- Parameter konfigurasi juga berbeda: gunakan `google.genai.types.GenerateContentConfig` (bukan `genai.types.GenerationConfig`).
- Update nama model ke: **`gemini-2.5-flash`** atau `gemini-2.0-flash`.

### 3. Update Error Handling
- Pastikan exception dari SDK baru tetap ditangkap dengan benar (periksa apakah `google.api_core.exceptions.ResourceExhausted` masih relevan di SDK baru).

---

## Reference (Contoh Kode Baru yang Benar)

```python
from google import genai
from google.genai import types

client = genai.Client(api_key='YOUR_API_KEY')

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='Your prompt here',
    config=types.GenerateContentConfig(
        system_instruction='...',
        max_output_tokens=8192,
        temperature=0.7,
    )
)
print(response.text)
```

---

## Acceptance Criteria

- [ ] `google-generativeai` dihapus dari `requirements.txt`, diganti dengan `google-genai`.
- [ ] `ai_service.py` berhasil direfactor ke pola SDK baru.
- [ ] Generate bank soal dari frontend berhasil tanpa error API model.
