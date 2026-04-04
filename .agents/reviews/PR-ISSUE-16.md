# Pull Request / Hasil Kerja untuk [ISSUE-16] Deep Refactor: AI Service Quality & Async Architecture

**Status execution:** Berhasil
**Changes:**
- **Backend Refactor:**
  - `ai_service.py`: Mengubah arsitektur dari sinkronus ke **Fully Async** menggunakan `AsyncGroq` dan Gemini `client.aio`.
  - `ai_service.py`: Mengganti blocking `time.sleep` dengan non-blocking `await asyncio.sleep`.
  - `ai_service.py`: Memperbarui `_truncate_content` dengan limit yang lebih ketat (8000 karakter) dan TODO untuk ekstraksi per halaman.
  - `ai_service.py`: Memperkuat prompt dengan instruksi negatif tegas (no classroom activity) dan skenario *contextual storytelling*.
  - `ai_service.py`: Implementasi dynamic JSON schema untuk menghemat token.
  - `ai_service.py`: Parser JSON sekarang lebih tangguh dengan fallback pencarian `{}` dalam string.
  - `routes/settings.py`: Endpoint pengujian koneksi sekarang memanggil fungsi async secara langsung.
- **Unit Testing:**
  - `tests/test_ai_service.py`: Menambahkan verifikasi untuk instruksi prompt baru dan parser JSON fallback.

**Validation:**
- Unit test backend `pytest backend/tests/test_ai_service.py` lulus (10 items).
- Kecepatan respons backend tidak terpengaruh oleh delay (event loop tidak terblokir).

Tolong Senior Agent review perombakan arsitektur ini.
