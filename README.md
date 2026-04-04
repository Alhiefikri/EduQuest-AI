# EduQuest AI 🧠

**Automated Teaching Module to Contextual Question Generator**

EduQuest AI adalah platform pintar berbasis AI yang dirancang untuk pendidik. Sistem ini memungkinkan guru untuk mengunggah Modul Ajar (PDF/Docx), lalu secara otomatis mengekstrak kontennya dan menghasilkan variasi soal (Pilihan Ganda, Essay, Isian) yang sangat kontekstual berdasarkan materi ajar tersebut, bukan dari pengetahuan umum AI belaka.

Semua soal yang digenerate dapat dikelola, diedit, dan diekspor ke dalam format *Microsoft Word (.docx)* menggunakan *template* kop surat resmi sekolah terkait.

## 🌟 Key Features

- **Smart Document Upload**: Upload modul ajar `.pdf` atau `.docx` dengan drag & drop, teks otomatis diekstrak dan disimpan.
- **AI-Powered Question Generation**: Menggunakan Gemini AI untuk membuat soal yang 100% relevan dengan konten modul.
- **Inline Question Editor**: Edit pertanyaan, pilihan ganda, dan kunci jawaban secara interaktif langsung dari dashboard web.
- **Template-based Word Export**: Ekspor soal ke format `.docx` siap cetak dengan template khusus (kop surat, header, footer).
- **Real-time Dashboard**: Lihat statistik dokumen, riwayat soal, dan AI insight dalam satu halaman.

## 🚀 Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4 | SPA modern dengan React Query untuk state management |
| **Backend** | Python 3.10+, FastAPI, Uvicorn | REST API async untuk AI Processing dan Document Parsing |
| **Database** | SQLite & Prisma ORM (prisma-client-py) | Penyimpanan data lokal yang ringan dan terstruktur |
| **AI Engine** | Google Gemini API (gemini-1.5-flash, Free Tier) | Mesin utama untuk generate soal berbasis konteks |
| **Document** | PyMuPDF (PDF), python-docx (Word) | Parsing dan generasi dokumen |

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Python 3.10+** (disarankan 3.14)
- **Node.js 18+** dan **npm**
- **Google Gemini API Key** — dapatkan gratis di [aistudio.google.com](https://aistudio.google.com/apikey)

## 🛠️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/Alhiefikri/EduQuest-AI.git
cd EduQuest-AI
```

### 2. Setup Backend

```bash
# Buat virtual environment
python3 -m venv backend/venv

# Aktifkan virtual environment
# Linux/macOS:
source backend/venv/bin/activate
# Windows:
backend\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env dan isi GEMINI_API_KEY Anda:
# GEMINI_API_KEY=your_api_key_here

# Jalankan Prisma migration (membuat database SQLite)
prisma db push
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# (Opsional) Setup environment variables
# Buat file .env di folder frontend/ dengan isi:
# VITE_API_URL=http://localhost:8000
```

### 4. Environment Variables

**Backend** (`backend/.env`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=file:./data/soal.db
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

## 🏃 Running the Application

Jalankan **kedua server** secara bersamaan di terminal terpisah:

### Terminal 1 — Backend (FastAPI)

```bash
cd EduQuest-AI
source backend/venv/bin/activate
uvicorn app.main:app --reload --app-dir backend
```

Backend akan berjalan di: **http://localhost:8000**
API Docs (Swagger): **http://localhost:8000/docs**

### Terminal 2 — Frontend (Vite)

```bash
cd EduQuest-AI/frontend
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

## 📡 API Endpoints

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/documents/upload` | Upload modul (PDF/DOCX) |
| GET | `/api/v1/documents` | List semua dokumen |
| GET | `/api/v1/documents/{id}` | Detail dokumen |
| DELETE | `/api/v1/documents/{id}` | Hapus dokumen |

### Soal (Questions)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/soal/generate` | Generate soal dengan AI |
| GET | `/api/v1/soal` | List semua soal |
| GET | `/api/v1/soal/{id}` | Detail soal |
| PUT | `/api/v1/soal/{id}` | Update soal |
| DELETE | `/api/v1/soal/{id}` | Hapus soal |

### Word Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/word/template` | Upload template Word |
| GET | `/api/v1/word/template` | List template |
| POST | `/api/v1/word/generate` | Generate dokumen Word dari soal |
| GET | `/api/v1/word/download/{soal_id}` | Download file .docx |

## 📁 Project Structure

```
EduQuest-AI/
├── backend/
│   ├── app/
│   │   ├── config.py              # Konfigurasi aplikasi
│   │   ├── main.py                # Entry point FastAPI
│   │   ├── database/              # Koneksi database Prisma
│   │   ├── models/                # Pydantic schemas
│   │   ├── services/              # Business logic (parser, AI, word)
│   │   └── routes/                # API endpoints
│   ├── tests/                     # Unit tests
│   ├── uploads/                   # File upload (gitignored)
│   ├── templates/                 # Template Word default
│   ├── outputs/                   # Output Word generated (gitignored)
│   ├── data/                      # Database SQLite (gitignored)
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── services/              # API client functions
│   │   ├── hooks/                 # React Query hooks
│   │   ├── pages/                 # Page components
│   │   ├── layouts/               # Layout components
│   │   └── App.tsx                # Root component + QueryClient
│   └── package.json
├── prisma/
│   └── schema.prisma              # Database schema
├── .agents/                       # AI Agent workflow files
│   ├── issues/                    # Task specifications
│   └── reviews/                   # PR review summaries
├── PRD.md                         # Product Requirements Document
└── README.md                      # This file
```

## 🧪 Running Tests

```bash
source backend/venv/bin/activate
PYTHONPATH=backend pytest backend/tests/ -v
```

## 🤝 Development Workflow

Project ini menggunakan **Multi-Agent Architecture** dengan Smart Agent (Architect/Reviewer) dan Execution Agent (Worker). Lihat [AGENT_WORKFLOW.md](.agents/AGENT_WORKFLOW.md) untuk detail SOP.

## 📄 License

This project is for educational purposes.

---

*Created with ❤️ powered by Collaborative AI Agents*
