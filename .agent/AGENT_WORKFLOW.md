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
  - Membuat file issue di dalam direktori `.agent/issues/` dan melakukan push ke Github.
  - Melakukan Code Review atas Pull Request (PR) Github dari hasil *Execution Agent*.
  - Memberikan komentar (feedback) untuk direvisi, lalu menyetujuinya (Merge branch) bila sudah sesuai standar.

### 👷 2. Execution Agent (The Worker)
- **Karakteristik:** Agent dengan model yang lebih murah dan cepat (contoh: Gemini 1.5 Flash / Claude 3 Haiku / spesialis IDE seperti Cursor/Cline). Hebat dalam eksekusi code, refactoring cepat, dan menjalankan command terminal.
- **Tugas Utama:**
  - Membaca issue yang dibuat Senior Agent dari `.agent/issues/`.
  - Membuat **branch** Git baru untuk menyelesaikan fungsionalitas fitur (DILARANG melakukan push langsung ke *origin main*).
  - Menulis dan memodifikasi *source code* tanpa deviasi dari *requirements*.
  - Melakukan Testing local.
  - Membuka Pull Request (PR) terhadap branch utama dan mengajukan file `.agent/reviews/PR-...` sebagai ringkasan.
  - Mengerjakan ulang revisi (Commit Ulang di branch yang sama) apabila mendapat komentar tambahan dari Senior Agent.

---

## 2. Alur Kerja (SOP) Kolaborasi Agent

### Step 1: Issue Generation (Oleh Senior Agent)
Smart Agent akan melihat `PRD.md` dan struktur project. Berdasarkan fase saat ini, Senior Agent akan menyusun task dan menaruhnya ke `.agent/issues/[Nama_Task].md`.

**Format File Issue (`.agent/issues/ISSUE-XX-[Nama_Task].md`):**
```markdown
# [ISSUE-01] Setup Basic FastAPI & SQLite
**Status:** Open / In Progress / Review / Done
**Assignee:** Junior Execution Agent

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
1. Execution Agent membaca `.agent/issues/ISSUE-XX.md` yang berstatus **Open**.
2. **Membuat Branch Baru**: Junior Agent mengeksekusi `git checkout -b feature/issue-XX`. 
3. Junior Agent merubah status file lokal ke **In Progress** lalu mengerjakan kodingan asli sesuai spesifikasi.
4. Setelah koding jalan, Agent membuat laporan di `.agent/reviews/PR-ISSUE-XX.md` dan merubah status ke **Review**.
5. Agent menaikkan ke Github (Commit & Push branch `feature/issue-XX`) sekaligus meminta pembukaan **Pull Request** ke branch `main`.

**Format File PR Review (`.agent/reviews/PR-ISSUE-XX.md`):**
```markdown
# Pull Request / Hasil Kerja untuk [ISSUE-01]
**Status execution:** Berhasil
**Changes:**
- Membuat folder `backend/app`
- Install `fastapi`, `uvicorn`, `prisma`
- Menjalankan migrasi prisma awal.

Tolong Senior Agent review kode saya lewat branch ini.
```

### Step 3: Review, Komentar & Merge (Oleh Senior Agent)
1. User meminta **Senior Agent** untuk me-review Pull Request yang diunggah Junior Agent.
2. Senior Agent mereview arsitektur, standar Clean Code, dan Acceptance Criteria.
3. **Jika ada bug/kurang tepat:** Senior Agent mencatat dafatar perbaikannya (komentar review) secara transparan pada `.agent/reviews/PR-ISSUE-XX.md`.
4. Junior Agent melihat komentar kembali, memperbaiki kode, lalu push ulasan *commit* barunya di PR branch yang sama.
5. **Jika kode terverifikasi (Approved):** Senior Agent akan mengeksekusi Git Merge dari branch tersebut menuju `main`, lalu merubah status file issue lokal menjadi **Done**.

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

Untuk mulai menjalankan SOP ini, jalankan perintah pembuatan sub-folder terpisah ini dalam terminal:
```bash
mkdir -p .agent/issues .agent/reviews
```
