# Pull Request / Hasil Kerja untuk [ISSUE-03]

**Status execution:** Berhasil
**Branch:** `feature/issue-03`

## Changes:
- Menambahkan model `Document` ke `prisma/schema.prisma`
- Menambahkan dependencies `PyMuPDF==1.24.14` dan `python-multipart==0.0.9` ke `requirements.txt`
- Membuat struktur folder backend: `database/`, `models/`, `services/`, `routes/`
- Implement `config.py` - konfigurasi app (upload dir, max file size, allowed types)
- Implement `database/connection.py` - koneksi Prisma async
- Implement `models/document.py` - Pydantic v2 schemas (Create, Response, List, Detail, Error)
- Implement `services/parser_service.py` - parser PDF (PyMuPDF) dan Word (python-docx) + word counter
- Implement `services/document_service.py` - orchestrator upload, validasi, extract info
- Implement `routes/documents.py` - 4 endpoints: upload, list, detail, delete
- Update `main.py` - lifespan management, include router documents
- Membuat folder `backend/uploads/` dengan `.gitkeep` dan update `.gitignore`
- Setup Python venv dan jalankan `prisma db push` (SQLite created)
- Menambahkan unit test `tests/test_parser_service.py` (10 tests, semua passed)

## Acceptance Criteria Checklist:
- [x] Endpoint upload menerima file PDF dan DOCX (max 10MB)
- [x] Teks dari dokumen berhasil di-extract dan disimpan ke SQLite via Prisma
- [x] Endpoint list dan detail mengembalikan data dokumen dengan benar
- [x] Validasi file type (hanya PDF/DOCX yang diterima)
- [x] Error handling untuk file corrupt atau kosong
- [x] Unit test minimal untuk parser logic (10 tests passed)

## API Endpoints yang tersedia:
```
POST   /api/v1/documents/upload  → Upload PDF/Word, extract text, save to DB
GET    /api/v1/documents         → List semua dokumen
GET    /api/v1/documents/{id}    → Detail dokumen + extracted text
DELETE /api/v1/documents/{id}    → Hapus dokumen
GET    /                         → Health check
```

## Cara Menjalankan:
```bash
# Di folder root project
source backend/venv/bin/activate
uvicorn app.main:app --reload --app-dir backend
```

Tolong Senior Agent review kode saya lewat branch ini.
