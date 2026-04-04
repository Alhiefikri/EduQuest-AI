### 📝 Senior Developer Code Review - Performance & UI Polish (Follow-up)

Halo Junior! Integrasi OpenRouter dan model Qwen-nya sudah berhasil berjalan. Namun, berdasarkan hasil *testing* langsung di *environment*, ada beberapa catatan kritis terkait **Performa (Lama Waktu Tunggu)** dan **Kerapian UI** yang harus kita optimalkan sebelum ini benar-benar siap dipakai oleh pengguna.

Tolong lakukan 3 perbaikan (Refactor) berikut di branch yang sama:

#### ⚡ 1. Optimasi Prompt AI (Backend - `ai_service.py`)
Saat melakukan *generate* 20 soal (contoh untuk kelas 6 SD), prosesnya memakan waktu hingga beberapa menit. Model Qwen 3.6 Plus memang sangat canggih, tetapi jika *System Prompt* dan *User Prompt* kita terlalu bertele-tele atau tidak efisien, model akan menghabiskan banyak waktu (dan token) hanya untuk memproses instruksi.
**Tugas:** Refaktor dan persingkat instruksi di `SYSTEM_PROMPT` dan `_build_user_prompt`. Buat instruksinya lebih *to-the-point* dan efisien (kurangi kata-kata pengantar yang tidak perlu) agar AI bisa langsung fokus men-generate JSON dengan cepat namun tetap akurat.

#### 🎨 2. UI Edit Soal - Textarea untuk Kunci Jawaban (Frontend - `EditSoal.tsx`)
Di halaman Editor Soal, *field* untuk input "Jawaban Benar" saat ini menggunakan komponen `<Input>` biasa (satu baris). Jika jawabannya panjang, teksnya akan terus memanjang ke kanan dan terpotong dari pandangan mata *user*.
**Tugas:** Ubah komponen `<Input>` pada properti `jawaban` menjadi `<Textarea>` (sama seperti komponen pertanyaan/pembahasan) dengan tinggi minimal (misal `min-h-[60px]`) agar teks panjang bisa *wrap* ke bawah dengan rapi.

#### 🗂️ 3. UI Generate Soal - Dropdown Fase & Kelas (Frontend - `GenerateSoal.tsx`)
Di halaman Generate Soal, input untuk "Fase" dan "Kelas" masih menggunakan *text input* biasa yang rawan *typo* dari pengguna.
**Tugas:** Ganti komponen `<Input>` untuk Fase dan Kelas menjadi komponen Dropdown (`<Select>` dari Shadcn UI). 
- **Opsi Fase:** Fase A, Fase B, Fase C, Fase D, Fase E, Fase F.
- **Opsi Kelas:** Kelas 1 SD s/d Kelas 12 SMA.
Ini akan membuat *form* jauh lebih rapi, profesional, dan datanya konsisten saat dikirim ke Backend.

---
**Status:** **Changes Requested** 🟡  
Kualitas model AI kita sudah di- *upgrade*, sekarang saatnya kita meng-*upgrade* performa dan *User Experience*-nya! Tolong segera selesaikan 3 poin di atas dan lakukan *push commit* terbarumu. Semangat! 🚀