# PRD - AI Question Generator (Soal AI Otomatis)

> **Version:** 1.0  
> **Status:** Draft  
> **Date:** April 2026

---

## 1. Overview

Sistem untuk meng-generate soal pelajaran secara otomatis berdasarkan modul ajar yang di-upload user. Soal yang dihasilkan relevan dengan konten modul, bisa diedit, dan di-export ke file Word dengan template custom (termasuk kop surat).

### 1.1 Masalah yang Dipecahkan

- AI chat biasa menghasilkan soal yang tidak sesuai konteks modul ajar
- Soal dari AI sering usang atau tidak relevan dengan materi yang diajarkan
- Tidak ada cara mudah untuk menyimpan dan mengelola soal yang sudah dibuat
- Format output terbatas, tidak bisa custom template Word

### 1.2 Solusi

- Upload modul ajar → AI baca & pahami konten → generate soal sesuai konteks
- Soal disimpan di database, bisa dipanggil & diedit ulang
- Export ke Word dengan template custom (kop surat, header, styling)

---

## 2. Tech Stack

| Layer | Technology | Keterangan |
|-------|-----------|------------|
| **Frontend** | React + Vite + TypeScript | SPA, ringan, fast dev |
| **Routing** | React Router | Multi-page navigation |
| **Styling** | Tailwind CSS | Utility-first, cepat |
| **Backend** | FastAPI (Python) | Async, auto-docs, ringan |
| **Database** | SQLite (Phase 1) | Zero setup, local |
| **ORM** | Prisma (Phase 1: SQLite) | Schema-first, type-safe |
| **LLM** | Google Gemini API (Free Tier) | 15 RPM, 1M tokens/min |
| **Doc Parser** | PyPDF2, python-docx | Parse PDF & Word modul |
| **Word Generator** | python-docx | Load template + inject soal |
| **Images** | Pollinations.ai | Gratis, no API key |
| **Hosting (Phase 2)** | Vercel (FE) + Render (BE) + Neon (DB) | Free tier |

---

## 3. Arsitektur

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                 │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Dashboard│  │ Upload   │  │ Editor Soal      │  │
│  │          │  │ Modul    │  │ + Preview Word   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Riwayat  │  │ Template │  │ Download .docx   │  │
│  │ Soal     │  │ Manager  │  │                  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────┐
│                    BACKEND (FastAPI)                │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Modul    │  │ Soal     │  │ AI Service       │  │
│  │ Parser   │  │ Generator│  │ (Gemini API)     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Word     │  │ Image    │  │ Database         │  │
│  │ Builder  │  │ Service  │  │ (SQLite/Prisma)  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 4. Fitur

### 4.1 Phase 1 - Core (Local)

#### F1. Upload Modul Ajar
- Upload file `.pdf` atau `.docx`
- Ekstrak teks dari file
- Preview teks yang terekstrak
- Simpan ke database dengan metadata:
  - Judul modul
  - Mata pelajaran
  - Kelas
  - Tanggal upload
  - Teks lengkap (untuk context AI)

#### F2. Generate Soal
- Pilih modul ajar dari database ATAU buat soal tanpa modul (manual)
- Konfigurasi soal:
  - **Mata pelajaran**: Dropdown pilih (Matematika, B. Indonesia, IPA, IPS, B. Inggris, PKn, Fisika, Kimia, Biologi, Sejarah, dll) + opsi custom input
  - **Topik/Kompetensi**: Input manual topik spesifik (opsional, auto-fill dari modul jika ada)
  - **Tipe soal**: pilihan ganda / isian / essay / campuran
  - **Jumlah soal**: Input angka (1-100), default 20
  - **Tingkat kesulitan**: mudah / sedang / sulit / campuran (auto-distribusi)
  - **Sertakan gambar**: ya/tidak
  - **Sertakan pembahasan**: ya/tidak
  - **Sertakan kunci jawaban terpisah**: ya/tidak (untuk halaman terpisah di Word)
- AI generate soal berdasarkan **konten modul** (bukan pengetahuan umum)
- Jika tanpa modul, AI generate berdasarkan mata pelajaran + topik yang diinput
- Output dalam format JSON terstruktur
- Simpan hasil generate ke database

#### F3. Edit Soal (Inline Editor)
- Tampilkan semua soal dalam list yang bisa diedit langsung di aplikasi
- Setiap soal bisa diedit:
  - **Pertanyaan**: Textarea editable
  - **Pilihan jawaban** (untuk PG): Input field A, B, C, D (bisa tambah/kurang pilihan)
  - **Kunci jawaban**: Dropdown/radio button pilih jawaban yang benar
  - **Pembahasan**: Textarea editable
  - **Gambar**: Upload gambar manual atau generate dari AI
- Aksi per soal:
  - Edit individual soal
  - Hapus soal
  - Pindah posisi soal (drag & drop atau up/down)
  - Tambah soal baru manual
- Aksi bulk:
  - **Simpan semua perubahan** (save all)
  - **Generate ulang** soal tertentu atau semua soal
  - **Export kunci jawaban** terpisah (opsional)
- Auto-save ke database setiap perubahan
- Preview tampilan Word sebelum download

#### F4. Custom Word Template
- Upload template `.docx` dengan kop surat & header custom
- Sistem inject soal ke template
- Support styling:
  - Kop surat (header)
  - Judul ujian
  - Nama siswa, kelas, tanggal (placeholder)
  - Layout soal (nomor, pilihan, gambar)
  - Footer (halaman)
- Download file `.docx` hasil generate

#### F5. Riwayat & Manajemen Soal
- Lihat semua soal yang pernah di-generate
- Filter berdasarkan:
  - Modul ajar
  - Tanggal
  - Tipe soal
  - Status (draft / finalized)
- Re-generate soal dari template yang sama
- Hapus soal

#### F6. Image Generation (Opsional)
- Generate gambar pendukung soal via Pollinations.ai
- Embed gambar ke Word
- Alternatif: upload gambar manual

### 4.2 Phase 2 - Online (Future)

- Multi-user + authentication
- Cloud database (Neon PostgreSQL)
- Deploy ke Vercel + Render
- Share soal antar user
- Template marketplace
- Batch generate (banyak modul sekaligus)

---

## 5. Database Schema

```prisma
model ModulAjar {
  id            String   @id @default(uuid())
  judul         String
  mataPelajaran String
  kelas         String
  kontenTeks    String   @db.Text
  filePath      String?  // path file asli
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  soal          Soal[]
}

model TemplateWord {
  id            String   @id @default(uuid())
  nama          String
  filePath      String   // path template .docx
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())

  soal          Soal[]
}

model Soal {
  id                String   @id @default(uuid())
  modulId           String?  // nullable kalau buat manual tanpa modul
  templateId        String?
  mataPelajaran     String   // "Matematika", "B. Indonesia", "IPA", dll
  topik             String?  // topik spesifik, auto-fill dari modul atau manual
  tipeSoal          String   // "pilihan_ganda" | "isian" | "essay" | "campuran"
  difficulty        String   // "mudah" | "sedang" | "sulit" | "campuran"
  jumlahSoal        Int
  includePembahasan Boolean  @default(true)
  includeKunci      Boolean  @default(true)
  includeGambar     Boolean  @default(false)
  dataSoal          String   @db.Text // JSON array soal lengkap dengan kunci jawaban
  status            String   @default("draft") // "draft" | "finalized"
  filePath          String?  // path file .docx hasil generate
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  modul             ModulAjar? @relation(fields: [modulId], references: [id])
  template          TemplateWord? @relation(fields: [templateId], references: [id])
}
```

---

## 6. API Endpoints

### Modul Ajar
```
POST   /api/modul          → Upload & parse modul
GET    /api/modul          → List semua modul
GET    /api/modul/:id      → Detail modul
DELETE /api/modul/:id      → Hapus modul
```

### Soal
```
POST   /api/soal/generate  → Generate soal dari modul
GET    /api/soal           → List semua soal
GET    /api/soal/:id       → Detail soal + data
PUT    /api/soal/:id       → Update soal (setelah edit)
DELETE /api/soal/:id       → Hapus soal
```

### Word
```
POST   /api/word/generate  → Generate .docx dari soal
POST   /api/word/template  → Upload template Word
GET    /api/word/template  → List template
GET    /api/word/download/:id → Download file .docx
```

### Image
```
POST   /api/image/generate → Generate gambar via Pollinations.ai
POST   /api/image/upload   → Upload gambar manual
```

---

## 7. AI Prompt Design

### System Prompt
```
Anda adalah guru berpengalaman yang ahli dalam membuat soal pelajaran.
Buat soal berdasarkan KONTEN MODUL yang diberikan, BUKAN dari pengetahuan umum Anda.
Pastikan soal relevan dengan materi, akurat, dan sesuai tingkat kesulitan.
```

### User Prompt Template
```
Buat {jumlah} soal {tipe_soal} berdasarkan materi berikut:

MATERI:
{konten_modul}

KONFIGURASI:
- Tingkat kesulitan: {difficulty}
- Sertakan pembahasan: {include_pembahasan}
- Bahasa: Indonesia

OUTPUT FORMAT (JSON):
{
  "soal": [
    {
      "nomor": 1,
      "pertanyaan": "...",
      "pilihan": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "jawaban": "B",
      "pembahasan": "...",
      "gambar_prompt": "deskripsi gambar jika perlu"
    }
  ]
}
```

---

## 8. UI/UX Wireframe

### 8.1 Dashboard
```
┌─────────────────────────────────────────────┐
│  📚 Soal AI Generator                       │
├─────────────────────────────────────────────┤
│  [+ Upload Modul]  [+ Generate Soal Baru]   │
│                                             │
│  Modul Ajar Terbaru                         │
│  ┌─────────────────────────────────────┐   │
│  │ Matematika Kelas 7 - Aljabar       │   │
│  │ Uploaded: 2 Apr 2026               │   │
│  │ [Generate Soal] [Lihat Detail]     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Soal Terakhir                              │
│  ┌─────────────────────────────────────┐   │
│  │ 20 Soal PG - Matematika Aljabar    │   │
│  │ Status: Draft | 2 Apr 2026         │   │
│  │ [Edit] [Download] [Hapus]          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 8.2 Generate Soal
```
┌─────────────────────────────────────────────┐
│  Generate Soal Baru                         │
├─────────────────────────────────────────────┤
│  Sumber Materi:                             │
│  (•) Dari Modul Ajar  ( ) Manual           │
│                                             │
│  Pilih Modul: [Dropdown modul ▼]            │
│                                             │
│  Mata Pelajaran: [Matematika ▼]             │
│  Topik/Kompetensi: [Aljabar - Persamaan]    │
│                                             │
│  Tipe Soal:  (•) Pilihan Ganda              │
│              ( ) Isian                      │
│              ( ) Essay                      │
│              ( ) Campuran                   │
│                                             │
│  Jumlah Soal: [20]                          │
│  Kesulitan:   [Sedang ▼]                    │
│  Pembahasan:  [✓] Sertakan                  │
│  Kunci Jawaban: [✓] Sertakan                │
│  Gambar:      [ ] Sertakan gambar pendukung │
│                                             │
│  [Generate Soal]                            │
└─────────────────────────────────────────────┘
```

### 8.3 Editor Soal
```
┌─────────────────────────────────────────────────────────┐
│  Edit Soal - Matematika Aljabar          [Save All]     │
├─────────────────────────────────────────────────────────┤
│  [✓] Tampilkan Kunci Jawaban    [Export Kunci Terpisah] │
│                                                         │
│  ── Soal 1 dari 20 ─────────────────────────────────── │
│  Pertanyaan:                                            │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Hasil dari 2x + 3 = 11 adalah...                  │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  A. [x = 3]    B. [x = 4]    C. [x = 5]    D. [x = 6] │
│                                                         │
│  Kunci Jawaban: [B ▼]    [✓] Sertakan Pembahasan       │
│  Pembahasan:                                            │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 2x + 3 = 11 → 2x = 8 → x = 4                    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [↑ Naik] [↓ Turun] [Hapus] [+ Tambah Gambar]          │
│                                                         │
│  ───────────────────────────────────────────────────── │
│  [< Prev]  Soal 1/20  [Next >]    [+ Tambah Soal Baru] │
│                                                         │
│  [Simpan Semua]  [Generate Ulang]  [Download Word]     │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Project Structure

```
soal-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ModulUploader.tsx
│   │   │   ├── SoalGenerator.tsx
│   │   │   ├── SoalEditor.tsx
│   │   │   ├── TemplateManager.tsx
│   │   │   └── WordPreview.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ModulList.tsx
│   │   │   ├── SoalList.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/
│   │   │   ├── useModul.ts
│   │   │   └── useSoal.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models/
│   │   │   ├── modul.py
│   │   │   ├── soal.py
│   │   │   └── template.py
│   │   ├── services/
│   │   │   ├── ai_service.py       # Gemini API calls
│   │   │   ├── parser_service.py   # PDF/Word parsing
│   │   │   ├── word_service.py     # python-docx operations
│   │   │   └── image_service.py    # Pollinations.ai
│   │   ├── routes/
│   │   │   ├── modul.py
│   │   │   ├── soal.py
│   │   │   ├── word.py
│   │   │   └── image.py
│   │   └── database/
│   │       └── connection.py
│   ├── templates/                  # Default Word templates
│   │   └── default.docx
│   ├── data/
│   │   └── soal.db                 # SQLite database
│   ├── requirements.txt
│   └── .env.example
│
├── prisma/
│   └── schema.prisma
│
└── README.md
```

---

## 10. Development Phases

### Phase 1 - Core (Local) - 2-3 Minggu
- [ ] Setup project structure
- [ ] Backend: FastAPI + SQLite + basic routes
- [ ] Backend: Modul parser (PDF/Word)
- [ ] Backend: AI service (Gemini API integration)
- [ ] Backend: Word generator (python-docx + template)
- [ ] Frontend: Dashboard
- [ ] Frontend: Upload modul
- [ ] Frontend: Generate soal
- [ ] Frontend: Edit soal
- [ ] Frontend: Download Word

### Phase 2 - Polish - 1 Minggu
- [ ] Template manager
- [ ] Image generation
- [ ] Riwayat & filter soal
- [ ] Error handling & loading states
- [ ] Testing

### Phase 3 - Online (Future)
- [ ] Auth system
- [ ] Migrate SQLite → Neon PostgreSQL
- [ ] Deploy frontend → Vercel
- [ ] Deploy backend → Render
- [ ] Multi-user support

---

## 11. Cost Estimation

| Service | Phase 1 (Local) | Phase 2 (Online) |
|---------|----------------|-----------------|
| Gemini API | **Gratis** (15 RPM) | **Gratis** (scale up: $0.0001/req) |
| Database | **Gratis** (SQLite) | **Gratis** (Neon free tier) |
| Frontend Host | **Gratis** (local) | **Gratis** (Vercel) |
| Backend Host | **Gratis** (local) | **Gratis** (Render free tier) |
| Images | **Gratis** (Pollinations) | **Gratis** |
| **Total** | **$0** | **$0** (free tier) |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gemini API rate limit (15 RPM) | Medium | Cache hasil generate, retry logic |
| PDF parsing gagal pada file tertentu | Medium | Support multiple parser, fallback ke manual input teks |
| python-docx limited styling | Low | Gunakan template-based approach, bukan create from scratch |
| AI generate soal tidak akurat | Medium | Prompt engineering, allow manual edit, re-generate option |
| SQLite tidak scale untuk multi-user | Low (Phase 1) | Schema Prisma ready untuk migrate ke PostgreSQL |

---

## 13. Success Metrics

- [ ] Bisa upload modul PDF/Word dan ekstrak teks dengan sukses (>90%)
- [ ] Generate soal relevan dengan konten modul (user satisfaction)
- [ ] Edit soal tanpa kehilangan data
- [ ] Export Word dengan kop surat & formatting benar
- [ ] Soal tersimpan & bisa dipanggil ulang
- [ ] Response time generate < 30 detik untuk 20 soal
