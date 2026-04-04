# [ISSUE-13] Feature: AI Provider Settings via Web UI

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** Medium  
**Type:** Feature

---

## Objective

User dapat mengatur API Key dan memilih AI Provider (Gemini / Groq) langsung dari halaman `/settings` di web, tanpa perlu edit file `.env` secara manual.

---

## High Level Scope

### Backend
- Buat endpoint baru untuk membaca dan menyimpan konfigurasi AI provider secara runtime.

### Frontend — `Settings.tsx`
- Tambahkan section **"AI Integration"** dengan:
  - **Toggle / Dropdown** untuk memilih provider: `Google Gemini` atau `Groq`
  - **Input API Key** (tipe `password` dengan toggle show/hide)
  - **Tombol Save** untuk menyimpan ke backend
  - (Bonus) **Tombol "Test Connection"** untuk memvalidasi API key sebelum disimpan

---

## Notes untuk Developer

> ⚠️ **Wajib gunakan Context7 MCP** untuk membaca dokumentasi terbaru SDK sebelum coding. Gunakan `/search?q=groq python` atau `/googleapis/python-genai` di Context7 untuk memastikan API yang diimplementasikan up-to-date.

---

## Acceptance Criteria

- [ ] User dapat memilih `Gemini` atau `Groq` dari UI dan menyimpan API Key-nya.
- [ ] Backend menggunakan provider yang dipilih tanpa perlu restart server.
- [ ] Nilai API Key tidak terekspos di frontend response (disensor/masked).
