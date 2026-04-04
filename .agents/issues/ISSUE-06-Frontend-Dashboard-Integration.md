# [ISSUE-06] Frontend API & Dashboard Integration

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** High  
**Ref:** `PRD.md` Section 4.2 (Frontend Features F1 & F5)

---

## Objective

Menghubungkan aplikasi Frontend React dengan Backend API lokal yang telah selesai dibangun, sekaligus mengaktifkan fungsionalitas halaman Dashboard untuk melihat daftar dokumen dan melakukan upload modul ajar.

---

## High Level Scope

### 1. API Client Setup
- Setup konfigurasi library *fetching* (misal: Axios atau Fetch bawaan) beserta interceptors untuk menghandle *base_url* backend (`VITE_API_URL`).
- Siapkan skema error handling global untuk menangkap pesan error dari API.

### 2. Dashboard Data Loading
- Hubungkan endpoint GET `/api/v1/documents` ke tabel / *list view* dokumen di halaman Dashboard.
- Tampilkan indikator status *loading* dan *empty view* jika belum ada data.

### 3. Fungsionalitas Upload Modul
- Aktifkan fitur tombol "Upload Berkas" untuk mengirimkan file (`.pdf`, `.docx`) ke endpoint POST `/api/v1/documents/upload`.
- Tampilkan feedback yang interaktif (contoh: status sedang mengupload / success toast).
- Otomatis update daftar dokumen di Dashboard setelah proses upload berhasil.

---

## Acceptance Criteria

- [ ] Aplikasi Frontend berhasil melakukan request API ke Backend lokal tanpa error CORS.
- [ ] Daftar dokumen pada Dashboard memuat data asli (real data) dari database.
- [ ] Formulir / Drag & Drop upload berhasil menyimpan file ke backend.
- [ ] Interaksi dilengkapi dengan state visual yang jelas (Loading / Error / Success).
