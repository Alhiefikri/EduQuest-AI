# Pull Request / Hasil Kerja untuk [ISSUE-03]

**Status execution:** Berhasil
**Branch:** `feature/issue-03`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/6
**Commits:** 4 (initial + review round 1 fixes + review round 2 fixes + round 2 nits)

---

## Commit 1: Initial Implementation

### Changes:
- Menambahkan model `Document` ke `prisma/schema.prisma`
- Menambahkan dependencies `PyMuPDF==1.24.14` dan `python-multipart==0.0.9` ke `requirements.txt`
- Membuat struktur folder backend: `database/`, `models/`, `services/`, `routes/`
- Implement `config.py` - konfigurasi app (upload dir, max file size, allowed types)
- Implement `database/connection.py` - koneksi Prisma async
- Implement `models/document.py` - Pydantic v2 schemas (Create, Response, List, Error)
- Implement `services/parser_service.py` - parser PDF (PyMuPDF) dan Word (python-docx) + word counter
- Implement `services/document_service.py` - orchestrator upload, validasi, extract info
- Implement `routes/documents.py` - 4 endpoints: upload, list, detail, delete
- Update `main.py` - lifespan management, include router documents
- Membuat folder `backend/uploads/` dengan `.gitkeep` dan update `.gitignore`
- Setup Python venv dan jalankan `prisma db push` (SQLite created)
- Menambahkan unit test `tests/test_parser_service.py` (10 tests, semua passed)

### Acceptance Criteria Checklist:
- [x] Endpoint upload menerima file PDF dan DOCX (max 10MB)
- [x] Teks dari dokumen berhasil di-extract dan disimpan ke SQLite via Prisma
- [x] Endpoint list dan detail mengembalikan data dokumen dengan benar
- [x] Validasi file type (hanya PDF/DOCX yang diterima)
- [x] Error handling untuk file corrupt atau kosong
- [x] Unit test minimal untuk parser logic (10 tests passed)

---

## Commit 2: Senior Agent Review Fixes

Setelah review dari Senior Agent, berikut semua issue yang sudah diperbaiki:

### 🔴 Critical Issues (Fixed 3/3)

1. **Delete endpoint tidak menghapus file fisik**
   - **Masalah:** `DELETE /{doc_id}` hanya hapus dari DB, file di `uploads/` tetap ada (orphaned files)
   - **Fix:** Tambah field `filepath` di Document model Prisma, simpan path saat upload, hapus file fisik via `delete_document_file()` saat delete endpoint dipanggil
   - **Files:** `schema.prisma`, `document_service.py`, `documents.py`

2. **`BASE_DIR` path salah di config.py**
   - **Masalah:** `Path(__file__).resolve().parent.parent.parent` → menunjuk ke project root (`soal-generate/`), bukan `backend/`
   - **Fix:** Ubah ke `Path(__file__).resolve().parent.parent` → sekarang `UPLOAD_DIR` = `backend/uploads/` (sesuai spec)
   - **Files:** `config.py`

3. **`DocumentResponse` dan `DocumentDetailResponse` duplikat**
   - **Masalah:** Kedua class 100% identik, tidak ada perbedaan field
   - **Fix:** Hapus `DocumentDetailResponse`, gunakan `DocumentResponse` saja. Tambah `from_prisma()` classmethod untuk mapping dari Prisma object
   - **Files:** `document.py`

### 🟡 Important Issues (Fixed 7/7)

4. **Route terlalu banyak logic (violates Single Responsibility)**
   - **Masalah:** `upload_document()` ~60 baris dengan business logic di route handler
   - **Fix:** Pindah semua logic ke `document_service.upload_document()`, route handler jadi tipis (hanya call service + handle HTTP errors)
   - **Files:** `documents.py`, `document_service.py`

5. **Manual object mapping berulang di setiap endpoint**
   - **Masalah:** Manual mapping dari Prisma object ke Pydantic model diulang 3x
   - **Fix:** Tambah `from_prisma()` classmethod di `DocumentResponse` dan `DocumentListResponse`
   - **Files:** `document.py`

6. **DOCX `page_count` estimasi tidak akurat**
   - **Masalah:** `len // 3000` menghasilkan 0 untuk dokumen pendek (< 3000 chars)
   - **Fix:** `max(1, len // 3000)` — minimal 1 halaman, tambah komentar penjelasan
   - **Files:** `parser_service.py`

7. **`validate_file()` tidak cek file size**
   - **Masalah:** Size validation baru terjadi setelah file di-read ke memory (buang memory/bandwidth)
   - **Fix:** Tambah cek `file.size` (Content-Length header) di `validate_file()` untuk reject awal
   - **Files:** `document_service.py`

8. **`import shutil` tidak terpakai**
   - **Masalah:** Import tapi tidak pernah dipanggil
   - **Fix:** Dihapus
   - **Files:** `documents.py`

9. **Tidak ada pagination di `list_documents`**
   - **Masalah:** Mengembalikan SEMUA dokumen tanpa limit — bisa besar saat 1000+ dokumen
   - **Fix:** Tambah query params `skip` (default 0) dan `limit` (default 20, max 100)
   - **Files:** `documents.py`

### 🟢 Minor Issues (Fixed 3/3)

10. **Error messages campur bahasa**
    - **Fix:** Semua error message pakai Bahasa Inggris yang konsisten
    - **Files:** `document_service.py`, `documents.py`

11. **Database connection pattern redundant**
    - **Masalah:** `get_db()` cek `is_connected()` setiap kali, padahal lifespan sudah handle
    - **Fix:** Simplify `get_db()` — langsung return `db`, trust lifespan
    - **Files:** `connection.py`

12. **`DocumentCreate` model tidak digunakan optimal**
    - **Masalah:** Dibuat lalu di-unpack lagi ke dict untuk Prisma
    - **Fix:** Hapus indirection, langsung pass dict ke service layer
    - **Files:** `documents.py`, `document_service.py`

---

## API Endpoints yang tersedia:

```
POST   /api/v1/documents/upload   → Upload PDF/Word, extract text, save to DB
GET    /api/v1/documents?skip=0&limit=20  → List dokumen (paginated)
GET    /api/v1/documents/{id}     → Detail dokumen + extracted text
DELETE /api/v1/documents/{id}     → Hapus dokumen dari DB + storage
GET    /                          → Health check
```

## Cara Menjalankan:

```bash
# Di folder root project
source backend/venv/bin/activate
uvicorn app.main:app --reload --app-dir backend
```

## Test Results:

```
10 passed, 5 warnings in 0.40s
```

Tolong Senior Agent review kode saya lewat branch ini.

---

## Commit 3: Review Round 2 Nits

Setelah review round 2 dari Senior Agent ("Approve with Nits"), berikut 3 nit yang sudah diperbaiki:

### Nit 1: `filepath` Exposed di API Response (Security)
- **Masalah:** `DocumentResponse` dan `DocumentListResponse` expose field `filepath` yang berisi path server internal ke client
- **Fix:** Hapus field `filepath` dari kedua response model. Field `filepath` tetap ada di database model (Prisma) dan `DocumentCreate` untuk keperluan internal, tapi tidak dikirim ke client
- **Files:** `models/document.py`

### Nit 2: Inline Imports di Route Functions
- **Masalah:** `from app.database.connection import get_db` ada di dalam function body di `list_documents`, `get_document`, `delete_document`
- **Fix:** Pindah ke top-level import di `routes/documents.py`
- **Files:** `routes/documents.py`

### Nit 3: Error Messages di `parser_service.py` Tidak Konsisten
- **Masalah:** Error message di parser service menggunakan gaya yang kurang formal ("rusak atau tidak valid", "mungkin berisi gambar saja")
- **Fix:** Perbaiki ke Bahasa Indonesia yang benar dan konsisten:
  - `"File PDF rusak atau tidak dapat dibaca: {detail}"` (sebelumnya: "tidak valid")
  - `"File PDF tidak mengandung teks. Kemungkinan file hanya berisi gambar."` (sebelumnya: "mungkin berisi gambar saja")
  - `"File Word rusak atau tidak dapat dibaca: {detail}"` (sebelumnya: "tidak valid")
- Semua error message di service layer juga sudah menggunakan Bahasa Indonesia yang benar
- **Files:** `parser_service.py`, `document_service.py`, `routes/documents.py`, `tests/test_parser_service.py`

### Test Results (masih 10/10 passing):

```
10 passed, 5 warnings in 0.26s
```
