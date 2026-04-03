# [ISSUE-01] Project Initialization & Framework Setup

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** Critical (Blocking semua issue lainnya)  
**Ref:** `PRD.md` Section 2 (Tech Stack) & Section 9 (Project Structure)

---

## Deskripsi High-Level

Inisiasi seluruh struktur folder project dan install semua framework/library yang dibutuhkan untuk **Phase 1 (Local)**. Project ini terdiri dari dua bagian utama: **Frontend (React + Vite)** dan **Backend (FastAPI Python)**. Keduanya harus bisa berjalan secara independen di localhost dan saling berkomunikasi via REST API.

Pastikan setiap dependency memiliki **versi yang di-lock** (pinned version) di `package.json` dan `requirements.txt`. Jangan gunakan `latest`.

---

## Acceptance Criteria

### Backend (Python - FastAPI)
- [ ] Folder `backend/` sudah terstruktur sesuai `PRD.md` Section 9.
- [ ] Virtual environment Python aktif dan berfungsi.
- [ ] Semua dependency terinstall: `fastapi`, `uvicorn`, `python-dotx`, `PyPDF2`, `python-dotenv`, `google-generativeai`.
- [ ] File `requirements.txt` berisi semua dependency **dengan versi yang di-pin**.
- [ ] `backend/app/main.py` bisa dijalankan (`uvicorn app.main:app`) dan return `{"status": "ok"}` di `GET /`.
- [ ] CORS dikonfigurasi untuk menerima request dari `localhost:5173` (port default Vite).
- [ ] File `.env.example` tersedia dengan placeholder `GEMINI_API_KEY`.

### Frontend (React + Vite + TypeScript)
- [ ] Folder `frontend/` sudah terstruktur sesuai `PRD.md` Section 9.
- [ ] Project Vite terinisiasi dengan template `react-ts`.
- [ ] Tailwind CSS terinstall dan terkonfigurasi.
- [ ] Semua dependency di `package.json` memiliki **versi yang di-pin** (bukan `^` atau `~`).
- [ ] `npm run dev` berjalan tanpa error di `localhost:5173`.
- [ ] Halaman default menampilkan teks "EduQuest AI" sebagai bukti frontend hidup.

### Database (Prisma + SQLite)
- [ ] Prisma ORM terinisiasi di root project (`prisma/schema.prisma`).
- [ ] Schema database sesuai dengan `PRD.md` Section 5 (model `ModulAjar`, `TemplateWord`, `Soal`).
- [ ] Database SQLite (`backend/data/soal.db`) berhasil di-generate via migrasi Prisma.

### Umum
- [ ] File `.gitignore` sudah mengabaikan: `node_modules/`, `__pycache__/`, `.env`, `*.db`, `venv/`.
- [ ] Kedua server (frontend & backend) bisa jalan **bersamaan** tanpa konflik port.

---

## Catatan Penting

- Baca `AGENT_WORKFLOW.md` sebelum mulai, terutama aturan **poin 7, 8, dan 9**.
- Jika ragu soal versi atau konfigurasi terbaru suatu framework, **gunakan Context7 MCP docs** untuk validasi.
- Setelah selesai, update status issue ini menjadi **Review** dan buat file `reviews/PR-ISSUE-01.md`.
