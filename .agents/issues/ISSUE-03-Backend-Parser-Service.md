# [ISSUE-03] Backend Parser Service

**Status:** Review  
**Assignee:** Execution Agent  
**Priority:** High  
**Ref:** `PRD.md` Section 5 (Core Features) & Section 6 (Tech Stack)

---

## Objective

Membuat endpoint FastAPI untuk menerima upload file dokumen (PDF/Word) dan mengekstrak teks secara terstruktur. Service ini menjadi fondasi utama agar AI bisa membaca konten modul ajar sebelum generate soal.

---

## Scope

### Endpoints

| Method | Route | Deskripsi |
|--------|-------|-----------|
| `POST` | `/api/v1/documents/upload` | Upload file PDF/Word, simpan metadata ke DB, return extracted text |
| `GET` | `/api/v1/documents` | List semua dokumen yang pernah di-upload |
| `GET` | `/api/v1/documents/{id}` | Detail dokumen beserta extracted text |
| `DELETE` | `/api/v1/documents/{id}` | Hapus dokumen dari DB dan storage |

### Parser Logic

- **PDF:** Gunakan `PyMuPDF` (`fitz`) untuk extract teks per halaman
- **Word (.docx):** Gunakan `python-docx` untuk extract paragraf dan tabel
- Simpan hasil extract ke field `content` di database (plain text)
- Hitung metadata: jumlah halaman, jumlah kata, ukuran file

### Database Schema (Prisma)

```prisma
model Document {
  id          String   @id @default(cuid())
  filename    String
  filetype    String   // "pdf" | "docx"
  filesize    Int      // bytes
  pageCount   Int
  wordCount   Int
  content     String   // extracted text
  uploadedAt  DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### File Storage

- Simpan file asli di folder `backend/uploads/`
- Folder ini harus di-`.gitignore`

---

## Acceptance Criteria

- [ ] Endpoint upload menerima file PDF dan DOCX (max 10MB)
- [ ] Teks dari dokumen berhasil di-extract dan disimpan ke SQLite via Prisma
- [ ] Endpoint list dan detail mengembalikan data dokumen dengan benar
- [ ] Validasi file type (hanya PDF/DOCX yang diterima)
- [ ] Error handling untuk file corrupt atau kosong
- [ ] Unit test minimal untuk parser logic

---

## Tech Stack

- FastAPI + Pydantic v2 (request/response schema)
- PyMuPDF (`fitz`) untuk PDF parsing
- `python-docx` untuk Word parsing
- Prisma Client Python untuk database
- `python-multipart` untuk file upload handling
