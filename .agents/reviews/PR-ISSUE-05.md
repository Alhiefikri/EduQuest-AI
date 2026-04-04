# Pull Request / Hasil Kerja untuk [ISSUE-05]

**Status execution:** Berhasil
**Branch:** `feature/issue-05`
**GitHub PR:** https://github.com/Alhiefikri/EduQuest-AI/pull/10

---

## Changes:
- Membuat `services/word_service.py` — python-docx template loading, placeholder replacement, document generation
- Membuat `models/word.py` — Pydantic v2 schemas (TemplateUploadResponse, TemplateListResponse, GenerateWordRequest, GenerateWordResponse)
- Membuat `routes/word.py` — 5 endpoints untuk template management dan Word generation
- Update `config.py` — menambah `TEMPLATES_DIR` dan `OUTPUTS_DIR`
- Update `main.py` — include router word
- Membuat `tests/test_word_service.py` — 12 unit test untuk word service logic
- Membuat folder `templates/` dan `outputs/` dengan `.gitkeep`

## Acceptance Criteria Checklist:
- [x] Bisa upload file template `.docx`
- [x] Bisa create dokumen baru berisi daftar soal ke .docx (berdasarkan template yg diupload)
- [x] Dokumen yg sudah digenerate bisa didownload oleh Frontend
- [x] Library python-docx berfungsi untuk membaca dan menulis dokumen

## API Endpoints yang tersedia:
```
POST   /api/v1/word/template              → Upload template Word (.docx)
GET    /api/v1/word/template              → List semua template
GET    /api/v1/word/template/{id}         → Detail template
POST   /api/v1/word/generate              → Generate dokumen Word dari soal
GET    /api/v1/word/download/{soal_id}    → Download file Word yang sudah di-generate
```

## Fitur Utama:

### Template Management
- Upload template `.docx` dengan validasi tipe file
- Simpan template di folder `backend/templates/`
- Simpan metadata ke database (nama, path, isDefault)
- List dan detail template

### Word Generation
- Ambil data soal dari database (JSON)
- Load template Word menggunakan python-docx
- Replace placeholder: `{{JUDUL_UJIAN}}`, `{{NAMA_SISWA}}`, `{{KELAS}}`, `{{TANGGAL}}`
- Generate soal dengan formatting:
  - Pilihan ganda: pertanyaan bold, pilihan A-D
  - Isian/Essay: pertanyaan bold, garis bawah jawaban
- Opsi kunci jawaban terpisah (halaman khusus di akhir dokumen)
- Simpan output ke folder `backend/outputs/`
- Update `filePath` di model Soal

### Auto Default Template
- Jika tidak ada template yang dipilih dan tidak ada template default
- Sistem auto-generate template sederhana dengan placeholder

## Cara Menjalankan:
```bash
source backend/venv/bin/activate
uvicorn app.main:app --reload --app-dir backend
```

## Test Results:
```
29 passed, 5 warnings in 1.64s
```
(10 parser + 7 AI + 12 word service tests)

Tolong Senior Agent review kode saya lewat branch ini.
