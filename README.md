# EduQuest AI 🧠
**Automated Teaching Module to Contextual Question Generator**

EduQuest AI adalah platform pintar berbasis AI yang dirancang untuk pendidik. Sistem ini memungkinkan guru untuk mengunggah Modul Ajar (PDF/Docx), lalu secara otomatis mengekstrak kontennya dan menghasilkan variasi soal (Pilihan Ganda, Essay) yang sangat kontekstual berdasarkan materi ajar tersebut, bukan dari pengetahuan umum AI belaka. 

Semua soal yang digenerate dapat dikelola, diedit, dan diekspor ke dalam format *Microsoft Word (.docx)* menggunakan *template* kop surat resmi sekolah terkait.

## 🌟 Key Features
- **Smart Context Extraction**: Mengekstrak teks dari modul ajar `.pdf` atau `.docx` dengan presisi tinggi.
- **AI-Powered Question Generation**: Menggunakan Gemini AI untuk membuat soal yang 100% relevan dengan *context* modul.
- **Inline Question Editor**: Edit pertanyaan, pilihan ganda, dan kunci jawaban secara interaktif langsung dari dashboard web.
- **Template-based Word Export**: Ekspor soal yang difinalisasi ke dalam format file `.docx` siap cetak dengan *template* khusus (kop surat, format standar ujian).

## 🚀 Tech Stack
| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend** | React, Vite, TypeScript, Tailwind | Antarmuka SPA yang *blazing-fast* dan sangat responsif. |
| **Backend** | Python, FastAPI | Servis API yang kuat dan *async* untuk AI Processing dan Document Parsing. |
| **Database** | SQLite & Prisma ORM | Penyimpanan data lokal (*Phase 1*) yang ringan namun scalable via ORM. |
| **AI Engine** | Google Gemini API (Free Tier) | Mesin utama eksekusi penalaran logis untuk membuat variasi pertanyaan. |

## 📁 System Architecture & Documentation
Project ini dibangun menggunakan model kolaborasi **Dual-Agent Architecture** (Smart Agent & Execution Agent). Untuk memahami standar operasionalnya, harap membaca dokumentasi internal berikut sebelum memulai *development*:
1. [Product Requirements Document (PRD)](./PRD.md) - Rincian arsitektur teknis menyeluruh, database schema, dan spesifikasi API.
2. [AI Collaboration Workflow](./AGENT_WORKFLOW.md) - Aturan main, SOP, dan pembagian peran ekskusi AI Agent di dalam *environment coding* ini.

## 🛠️ Getting Started (For Agent Collaborators)
Bagi para kontributor atau Eksekutor (*The Execution Agent*):
1. Pantau direktori `issues/` (seperti `ISSUE-01-Setup-Backend.md`) untuk mengidentifikasi tugas saat ini.
2. Baca pedoman di dalam `AGENT_WORKFLOW.md` secara keseluruhan.
3. Selalu perhatikan instruksi penguncian versi (*version pinning*) pada `requirements.txt` dan `package.json`. Jangan mengubah versi/dependensi tanpa mandat yang eksplisit dari dokumen *issue* yang sedang terbuka.

---
*Created with ❤️ powered by Collaborative AI Agents*
