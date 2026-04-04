# [ISSUE-04] AI Soal Generation Service — Gemini API Integration

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** High  
**Ref:** `PRD.md` Section 4.1 (F2: Generate Soal) & Section 7 (AI Prompt Design)

---

## Objective

Membuat service integrasi Gemini API untuk generate soal pelajaran berdasarkan konten modul yang sudah di-upload (ISSUE-03). Service ini adalah **fitur inti utama** dari EduQuest AI.

---

## Scope

### AI Service
- Buat `ai_service.py` yang memanggil Google Gemini API
- Implementasi prompt engineering sesuai PRD Section 7
- AI harus generate soal berdasarkan **konten modul** (bukan pengetahuan umum)
- Output dalam format JSON terstruktur
- Handle rate limiting (15 RPM free tier) dan error response dari Gemini

### Soal API Endpoints

| Method | Route | Deskripsi |
|--------|-------|-----------|
| `POST` | `/api/v1/soal/generate` | Generate soal dari modul atau manual input |
| `GET` | `/api/v1/soal` | List semua soal (paginated) |
| `GET` | `/api/v1/soal/{id}` | Detail soal + data JSON |
| `PUT` | `/api/v1/soal/{id}` | Update soal (setelah edit) |
| `DELETE` | `/api/v1/soal/{id}` | Hapus soal |

### Konfigurasi Generate
- Pilih modul dari database ATAU input manual tanpa modul
- Konfigurasi: mata pelajaran, topik, tipe soal, jumlah, kesulitan, sertakan pembahasan/kunci

### Database
- Gunakan model `Soal` yang sudah ada di `schema.prisma`
- Simpan hasil generate ke field `dataSoal` (JSON)
- Relasi ke `ModulAjar` (opsional) dan `TemplateWord` (opsional)

---

## Acceptance Criteria

- [ ] Endpoint generate menerima konfigurasi soal dan return soal dalam format JSON
- [ ] AI generate soal yang relevan dengan konten modul (bukan general knowledge)
- [ ] Support tipe soal: pilihan ganda, isian, essay
- [ ] Support tingkat kesulitan: mudah, sedang, sulit
- [ ] Hasil generate tersimpan ke database
- [ ] CRUD endpoints untuk soal berfungsi dengan benar
- [ ] Error handling untuk API rate limit dan response error
- [ ] Unit test untuk AI service logic

---

## Tech Stack

- Google Gemini API (`google-generativeai`)
- FastAPI + Pydantic v2
- Prisma Client Python
