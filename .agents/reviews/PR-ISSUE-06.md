# Pull Request / Hasil Kerja untuk [ISSUE-06]

**Status execution:** Berhasil
**Branch:** `feature/issue-06`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/12

---

## Changes:
- Install `axios` sebagai HTTP client
- Setup `.env` dengan `VITE_API_URL=http://localhost:8000`
- Membuat `types/index.ts` — TypeScript interfaces untuk semua API response
- Membuat `services/api.ts` — Axios client dengan global error interceptor
- Membuat `services/documents.ts` — API calls (getDocuments, uploadDocument, deleteDocument)
- Membuat `hooks/useDocuments.ts` — Custom hook dengan loading, error, refetch state
- Membuat komponen `UploadModal` — drag & drop upload dengan validasi file, loading spinner, success checkmark, error alert
- Update `Dashboard.tsx` — connect ke real API, tampilkan loading skeleton, empty view, error state
- Tambah Vite proxy config untuk `/api` routes
- Tambah `vite-env.d.ts` untuk type safety `import.meta.env`
- TypeScript check passed tanpa error (`npx tsc --noEmit`)

## Acceptance Criteria Checklist:
- [x] Aplikasi Frontend berhasil melakukan request API ke Backend lokal tanpa error CORS
- [x] Daftar dokumen pada Dashboard memuat data asli (real data) dari database
- [x] Formulir / Drag & Drop upload berhasil menyimpan file ke backend
- [x] Interaksi dilengkapi dengan state visual yang jelas (Loading / Error / Success)

## API Integration:

| Frontend | Backend Endpoint | Purpose |
|----------|-----------------|---------|
| `useDocuments()` | `GET /api/v1/documents` | Load daftar dokumen |
| `uploadDocument(file)` | `POST /api/v1/documents/upload` | Upload PDF/DOCX |
| `deleteDocument(id)` | `DELETE /api/v1/documents/{id}` | Hapus dokumen |

## Fitur Upload Modal:
- Drag & drop atau klik untuk pilih file
- Validasi tipe file (hanya PDF/DOCX) dan ukuran (max 10MB)
- Loading spinner saat upload
- Success checkmark dengan auto-refetch setelah 1.5 detik
- Error alert dengan pesan dari backend
- Klik backdrop untuk close (disabled saat uploading)

## Cara Menjalankan:
```bash
# Backend
source backend/venv/bin/activate
uvicorn app.main:app --reload --app-dir backend

# Frontend (terminal terpisah)
cd frontend
npm run dev
```

Tolong Senior Agent review kode saya lewat branch ini.
