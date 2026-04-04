# [ISSUE-15] Refactoring: UI Design Modernization with Custom Theme
**Status:** Review  
**Assignee:** Execution Agent  
**Priority:** Medium  
**Type:** Refactor / Enhancement

---

## Objective
Melakukan refactoring terhadap struktur User Interface (UI) di sisi Frontend agar lebih modern dan berkarakter, dengan memanfaatkan **Shadcn**, **Tailwind CSS**, dan ekosistem kostumisasi dari **Tweak CN**.

## Scope of Work (High-Level)
1. **Instalasi Infrastruktur UI & Tema Baru**  
   - Konfigurasi **Shadcn** di proyek frontend (`frontend` directory).
   - Terapkan design system / warna standar "Tweak CN" (skema Neo Brutalism) menggunakan perintah berikut:
     `pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/neo-brutalism.json`

2. **Standardisasi Komponen (DRY Principle)**  
   - Gantikan komponen-komponen statis atau *in-line styling* yang berulang (misal: *Buttons, Inputs, Cards, Dialogs*) dengan komponen bentukan *Shadcn* yang telah disuntik tema dari *Tweak CN* tadi.
   - Pindahkan seluruh utilitas visual ke dalam arsitektur yang terpusat sehingga tidak ada redudansi class Tailwind yang panjang di seluruh template halaman.

3. **Penerapan Best Practice Design System**  
   - Pastikan implementasi konsisten pada halaman-halaman inti seperti `Dashboard`, `Generate Soal`, `Daftar Soal`, `Modul Ajar`, dll.
   - Pertahankan prinsip **DRY (Don't Repeat Yourself)** selama refactoring.

## Acceptance Criteria
- [ ] Eksekusi `pnpm dlx shadcn@latest ...` berhasil terimplementasi di level konfigurasi framework.
- [ ] Gaya desain seluruh project diremajakan menggunakan Tweak CN tanpa merusak logic fungsionalitas UI yang sudah berjalan.
- [ ] Komponen umum diabstraksi sebagai reusable interface di folder `/components/ui`.
- [ ] Tesis *best practice* (efisien, maintainable, non-repetitif) terwujud dalam baris-baris kode rekayasaan Frontend.
