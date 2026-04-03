# AI Agent Collaboration Workflow & Environment Rules

> **Project:** Soal AI Otomatis (Generator Soal dari Modul Ajar)
> **Goal:** Menyediakan environment (SOP) baku tentang bagaimana Multi-Agent (Smart Agent & Execution Agent) berkolaborasi untuk membangun project ini mulai dari setup hingga deployment.

---

## 1. Konsep Multi-Agent Architecture

Sistem kerja ini menggunakan dua peran utama AI Agent untuk menghemat biaya (token) dan meminimalisir kesalahan arsitektur:

### 🌟 1. Smart Agent (The Architect / Reviewer)
- **Karakteristik:** Agent dengan model tertinggi (contoh: Claude 3.5 Sonnet / Gemini 1.5 Pro). Pintar pemahaman konteks, memori kuat, hebat dalam review kode dan sistem desain.
- **Tugas Utama:**
  - Memastikan *Product Requirements Document* (PRD) dipatuhi.
  - Memecah Phase di PRD menjadi tugas-tugas teknis (Issues).
  - Membuat tiket issue di direktori `issues/`.
  - Melakukan Code Review dari hasil kerja *Execution Agent*.
  - Menyetujui (Merge) atau memberikan revisi atas tugas yang dikerjakan.

### 👷 2. Execution Agent (The Worker)
- **Karakteristik:** Agent dengan model yang lebih murah dan cepat (contoh: Gemini 1.5 Flash / Claude 3 Haiku / spesialis IDE seperti Cursor/Cline). Hebat dalam eksekusi code, refactoring cepat, dan menjalankan command terminal.
- **Tugas Utama:**
  - Mengambil issue dari direktori `issues/`.
  - Menulis dan memodifikasi *source code* sesuai instruksi issue.
  - Melakukan testing *local* / memastikan tidak ada error syntax.
  - Memberikan notifikasi bahwa tugas selesai (membuat Pull Request / Review Note).

---

## 2. Alur Kerja (SOP) Kolaborasi Agent

### Step 1: Issue Generation (Oleh Smart Agent)
Smart Agent akan melihat `PRD.md` dan struktur project. Berdasarkan fase saat ini, Smart Agent akan membuat file issue baru, contoh: `issues/ISSUE-01-Setup-FastAPI.md`.

**Format File Issue (`issues/ISSUE-XX-[Nama_Task].md`):**
```markdown
# [ISSUE-01] Setup Basic FastAPI & SQLite
**Status:** Open / In Progress / Review / Done
**Assignee:** Execution Agent

## Deskripsi High-Level
Setup folder `backend/`, inisialisasi lingkungan virtual Python, install FastAPI, dan koneksi ke SQLite menggunakan Prisma ORM sesuai dengan skema di PRD.

## Acceptance Criteria (Syarat Selesai)
- [ ] Terdapat file `backend/app/main.py` yang bisa menyala di port 8000.
- [ ] Endpoint `GET /` me-return JSON: `{"status": "API is running"}`.
- [ ] Database SQLite (`data/soal.db`) ter-generate via Prisma.
- [ ] File `requirements.txt` berisi daftar dependensi.

## Instruksi Tambahan (Context)
- Gunakan Python 3.10+
- Jangan lupa setup CORS untuk frontend di sisi localhost.
```

### Step 2: Eksekusi (Oleh Execution Agent)
1. Execution Agent membaca `PRD.md` (sekilas batas scope) dan secara spesifik membaca file `issues/ISSUE-XX.md` yang berstatus **Open**.
2. Execution Agent merubah status di file issue menjadi **In Progress**.
3. Menulis *code*, membuat file/folder, menginstall dependencies (Misal di terminal OS via user).
4. Setelah koding selesai dan jalan di lokal, Agent merubah status di file issue menjadi **Review** dan membuat file PR Review: `reviews/PR-ISSUE-XX.md`.

**Format File PR Review (`reviews/PR-ISSUE-XX.md`):**
```markdown
# Pull Request / Hasil Kerja untuk [ISSUE-01]
**Status execution:** Berhasil
**Changes:**
- Membuat folder `backend/app`
- Install `fastapi`, `uvicorn`, `prisma`
- Menjalankan migrasi prisma awal.

Tolong Smart Agent / User review kode saya di `backend/app/main.py` dan `prisma/schema.prisma`.
```

### Step 3: Review & Kualifikasi (Oleh Smart Agent / User)
1. User meminta **Smart Agent** untuk memeriksa hasil kerja `PR-ISSUE-XX`.
2. Smart Agent memeriksa file yang dirubah. Membandingkan fungsionalitas dengan **Acceptance Criteria** di issue awal.
3. **Jika ada bug/kurang tepat:** Smart Agent mencatat feedbacknya di file `reviews/PR-ISSUE-XX.md` dan mengubah status issue kembali ke **In Progress** agar si Pekerja membenarkannya lagi.
4. **Jika sudah sempurna (Approved):** Smart Agent memberikan tanda Approved, menyuruh user commit ke Git (atau eksekusi Git Merge kalau ada branch), dan merubah status di file Issue menjadi **Done**.

---

## 3. Aturan Main (Environment Rules) yang Harus Dipatuhi Agent

Aturan ini harus di baca oleh **KEDUA AGENT** setiap kali memulai sesi.

1. **JANGAN MERUBAH PRD.md:** `PRD.md` adalah kitab suci/sumber kebenaran. Hanya User dan Smart Agent di sesi terpisah yang boleh memperbaruinya.
2. **Execution Agent DILARANG Membuat Keputusan High-Level:** Jika di issue disuruh pakai SQLite, jangan diam-diam membuang SQLite dan pindah ke PostgreSQL tanpa *approval*. Jika bingung, tanyakan pada User/Smart Agent.
3. **Write Unit Tests Ketika Bisa:** Execution Agent sebisa mungkin menambahkan script sederhana untuk memastikan kode tidak error (misal testing API via file `test_main.py`).
4. **Minimalisir Kode Sampah:** Jangan menyisakan `console.log` atau `print()` buangan dari proses debungging saat status di-set ke *Review*.
5. **No Hallucinations pada Tools:** Khusus Execution agent, jalankan terminal commands (seperti `npm install` atau `pip install`) dengan yakin dan sampaikan apa command yang harus dirun jika sistem membutuhkan manual input dari User.
6. **Selalu Update Status:** File markdown untuk Issue wajib terus diupdate status-nya agar tidak tumpang tindih.
7. **Best Practice & Clean Code:** Semua Agent WAJIB menerapkan prinsip *Clean Code* (penamaan variabel deskriptif, modular, DRY, hindari nested if terlalu dalam) dan mengikuti standard *Best Practice* resmi dari bahasa / framework yang digunakan (contoh: Pydantic schemas di FastAPI, custom hooks di React).
8. **Validasi Framework (Gunakan Context7):** Jika ragu tentang *best practice* terbaru dari sebuah library atau menemui *error* framework aneh (misal: update syntax Prisma/Tailwind/FastAPI terbaru), Agent WAJIB memanggil **`use context7 mcp docs`** untuk membaca referensi API murni langsung dari sumbernya, ketimbang berasumsi secara halusinasi.
9. **Konsistensi Tech Stack & Versi:** Semua Agent DILARANG menggunakan versi library yang saling tabrakan. Execution agent **wajib mengecek** spesifikasi versi framework yang digunakan (lihat `package.json` atau `requirements.txt`). Gunakan versi yang tertulis, **jangan** sembarangan *upgrade* ke versi terbaru (`latest`) kecuali ada instruksi eksplisit dari Smart Agent di tiket issue.


---
## 4. Inisiasi Folder Environment

Untuk mulai menjalankan SOP ini, jalankan perintah pembuatan folder ini dalam terminal:
```bash
mkdir -p issues reviews
```
