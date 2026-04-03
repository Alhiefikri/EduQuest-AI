# [ISSUE-01] Project Initialization & Framework Setup

**Status:** Review  
**Assignee:** Execution Agent  
**Priority:** Critical (Blocking semua issue lainnya)  
**Ref:** `PRD.md` Section 2 (Tech Stack) & Section 9 (Project Structure)

---

## Deskripsi High-Level

Inisiasi seluruh struktur folder project dan install semua framework/library yang dibutuhkan untuk **Phase 1 (Local)**. Project ini terdiri dari dua bagian utama: **Frontend (React + Vite)** dan **Backend (FastAPI Python)**. Keduanya harus bisa berjalan secara independen di localhost dan saling berkomunikasi via REST API.

---

## Acceptance Criteria

### Backend (Python - FastAPI)
- [x] Folder `backend/` sudah terstruktur sesuai `PRD.md` Section 9.
- [x] Virtual environment Python aktif dan berfungsi. (Requirements installed)
- [x] Semua dependency terinstall: `fastapi`, `uvicorn`, `python-docx`, `PyPDF2`, `python-dotenv`, `google-generativeai`.
- [x] File `requirements.txt` berisi semua dependency **dengan versi yang di-pin**.
- [x] `backend/app/main.py` bisa dijalankan dan return `{"status": "ok"}` di `GET /`.
- [x] CORS dikonfigurasi untuk menerima request dari `localhost:5173`.
- [x] File `.env.example` tersedia.

### Frontend (React + Vite + TypeScript)
- [x] Folder `frontend/` sudah terstruktur.
- [x] Project Vite terinisiasi dengan template `react-ts`.
- [x] Tailwind CSS terinstall dan terkonfigurasi.
- [x] `npm run dev` berjalan tanpa error.
- [x] Halaman default menampilkan "EduQuest AI".

### Database (Prisma + SQLite)
- [x] Prisma ORM terinisiasi di root project (`prisma/schema.prisma`).
- [x] Schema database sesuai dengan `PRD.md`.
- [x] Database SQLite siap di-migrate.
