# 🔍 Code Review - PR #2: ISSUE-01 Project Initialization

**Reviewer:** Senior Agent (Architect)  
**Status:** ❌ Changes Requested  
**Date:** 2026-04-03

---

## Ringkasan

Struktur dasar project sudah terbentuk (folder backend/frontend/prisma, main.py, App.tsx), namun ada **6 temuan kritis** yang harus diperbaiki sebelum PR ini layak di-merge.

---

## 🔴 Temuan Kritis (WAJIB Diperbaiki)

### 1. `package.json` - Dependency version TIDAK di-pin
**File:** `frontend/package.json`  
**Masalah:** Semua versi di `package.json` masih menggunakan notasi `^` (caret), contoh: `"react": "^19.2.4"`. Ini melanggar **AGENT_WORKFLOW.md aturan #9** (Konsistensi Tech Stack & Versi).  
**Solusi:** Hapus semua prefix `^` dan `~` agar versi benar-benar terkunci (*pinned*). Contoh: `"react": "19.2.4"`.

### 2. Tailwind CSS BELUM terinstall
**File:** `frontend/package.json`  
**Masalah:** File `tailwind.config.js` sudah ada dan `index.css` sudah pakai directive `@tailwind`, tapi package `tailwindcss`, `postcss`, dan `autoprefixer` **tidak ada** di `devDependencies`. Ini akan menyebabkan build error.  
**Solusi:** Jalankan `npm install -D tailwindcss postcss autoprefixer` di folder `frontend/`, lalu pastikan masuk ke `package.json` dengan versi yang di-pin.

### 3. `requirements.txt` - Typo nama package
**File:** `backend/requirements.txt`  
**Masalah:** Tertulis `python-docx==1.1.2` di requirements. Nama package PyPI yang benar adalah `python-docx`, ini sudah benar. Namun yang perlu dicek adalah kompatibilitas versi `prisma==0.15.0` — library Prisma Client Python yang terakhir aktif mungkin memiliki versi yang berbeda. Gunakan **Context7** untuk memvalidasi.  
**Solusi:** Verifikasi semua versi library di `requirements.txt` masih valid dan bisa diinstall tanpa error.

### 4. `PRD.md` terhapus dari root project  
**Masalah:** Di diff terlihat file `PRD.md` dan `AGENT_WORKFLOW.md` **dipindahkan** ke folder `.agent/`, tapi `PRD.md` seharusnya **tetap ada di root** karena berfungsi sebagai dokumentasi publik project (dirujuk oleh `README.md`). Saat ini `README.md` masih mereferensikan `./PRD.md` yang sudah tidak ada.  
**Solusi:** Kembalikan `PRD.md` ke root project, atau update link di `README.md` ke `.agent/PRD.md`.

### 5. Prisma Generator salah untuk ekosistem Python
**File:** `prisma/schema.prisma`  
**Masalah:** Generator menggunakan `provider = "prisma-client-js"` (untuk JavaScript/Node.js), padahal backend kita adalah **Python (FastAPI)**. Jika kita menggunakan Prisma dari sisi Python, generator-nya harus `prisma-client-py`. Atau jika Prisma hanya digunakan untuk migrasi schema saja, ini masih bisa diterima — tapi harus didokumentasikan.  
**Solusi:** Klarifikasi apakah Prisma digunakan dari Python atau hanya untuk schema management. Jika dari Python, ubah generator ke `prisma-client-py`.

### 6. File sampah ikut masuk ke commit
**Masalah:** Terdapat file bawaan Vite yang tidak relevan ikut masuk: `frontend/public/icons.svg`, `frontend/src/assets/hero.png`, `frontend/src/assets/vite.svg`, `frontend/src/assets/react.svg`. File-file ini adalah *boilerplate* default Vite yang seharusnya dibersihkan.  
**Solusi:** Hapus semua file asset bawaan Vite yang tidak dipakai oleh `App.tsx` kita.

---

## 🟡 Catatan Minor (Saran, Tidak Blocking)

- **`backend/app/main.py`**: Kode sudah bersih dan sesuai best practice FastAPI. ✅
- **`.gitignore`**: Sudah komprehensif. ✅
- **`prisma/schema.prisma`**: Model data sudah sesuai PRD Section 5. ✅  
- **`frontend/src/App.tsx`**: Desain hero section sudah cukup baik untuk placeholder. ✅

---

## Instruksi untuk Junior Agent

Perbaiki semua 6 temuan **🔴 Kritis** di atas:
1. Pin semua versi di `package.json` (hapus `^` dan `~`).
2. Install `tailwindcss`, `postcss`, `autoprefixer` dan tambahkan ke `devDependencies`.
3. Validasi versi library di `requirements.txt` (gunakan Context7).
4. Kembalikan `PRD.md` ke root atau perbaiki link di `README.md`.
5. Perbaiki Prisma generator atau dokumentasikan penggunaannya.
6. Hapus file asset bawaan Vite yang tidak terpakai.

Setelah selesai, **push commit perbaikan ke branch `feature/issue-01` yang sama**, lalu update status PR.
