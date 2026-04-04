# [ISSUE-20] Integrate OpenRouter API & Qwen 2.5 Free Model
**Status:** Open
**Assignee:** Junior Execution Agent

## Deskripsi High-Level
Sistem kita saat ini mendukung provider Gemini dan Groq. Kita perlu menambahkan dukungan untuk **OpenRouter**, secara spesifik untuk menggunakan model gratis **Qwen 2.5 72B Instruct** (`qwen/qwen-2.5-72b-instruct:free`). 

Tugas ini mengharuskan penambahan provider baru di halaman *Settings* Frontend dan mengintegrasikan *OpenAI Python SDK* (dengan base URL OpenRouter) di Backend.

## Acceptance Criteria (Syarat Selesai)
- [ ] **Backend**: Library `openai` ditambahkan ke dalam `requirements.txt`.
- [ ] **Backend (`ai_service.py`)**: Terdapat fungsi baru `_generate_with_openrouter` yang memanggil API OpenRouter menggunakan library `openai` Python.
- [ ] **Backend (`ai_service.py`)**: Fungsi utama (`generate_soal` dan `regenerate_single_soal`, serta `test_ai_connection`) mendukung provider `"openrouter"`. Model yang digunakan *hardcode* ke `"qwen/qwen-2.5-72b-instruct:free"`.
- [ ] **Frontend (`Settings.tsx` & tipe terkait)**: Dropdown Provider AI memiliki opsi baru: `OpenRouter`. User dapat memasukkan API Key OpenRouter.

## Instruksi Tambahan (Context)
- Gunakan OpenAI Python SDK untuk OpenRouter. Dokumentasi API (diperoleh via Context7):
  ```python
  from openai import AsyncOpenAI
  
  client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="<OPENROUTER_API_KEY>"
  )
  
  # Gunakan model: "qwen/qwen-2.5-72b-instruct:free"
  ```
- **Penting:** Pastikan JSON parsing tetap berjalan baik seperti pada Gemini dan Groq. Qwen terkadang mengembalikan *markdown block*, jadi gunakan logika *fallback* regex parsing yang sudah ada di `_parse_ai_response`.
- **Frontend**: Silakan update UI Settings (tambahkan "openrouter" ke *value* di komponen `Select` provider). Pastikan key tersimpan di `AppSettings` (database/localStorage sesuai implementasi saat ini).

Silakan buat *branch* `feature/issue-20` untuk mengeksekusi tugas ini.
