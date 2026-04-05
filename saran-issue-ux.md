# Design & UX Review: Form Generate Soal
> **Audience**: Senior Developer + Product Owner  
> **Scope**: Seluruh flow 3-step form `GenerateSoal.tsx` beserta kaitannya dengan `ai_service.py`  
> **Konteks pengguna**: Guru SD–SMA, mayoritas tidak berlatar belakang teknis, akses via mobile dan desktop

---

## Executive Summary

Form ini secara teknis sudah berjalan, tapi memiliki **tiga lapisan masalah yang saling berkaitan**: mismatch antara UI dan backend, konsep pedagogis yang kurang tepat di layer input, dan beberapa keputusan UX yang tidak berpihak pada persona guru sebagai pengguna utama. Jika dibiarkan, masalah-masalah ini akan menciptakan gap antara ekspektasi guru dengan hasil soal yang dihasilkan AI — tanpa guru menyadari di mana letak kegagalannya.

---

## Lapisan 1 — Critical Bugs (Harus Difix Sebelum Production)

### BUG-01: Gaya Soal Frontend Tidak Sinkron dengan Backend

**Apa yang terjadi:**  
Frontend menampilkan opsi gaya soal yang tidak dikenali oleh backend.

```
Frontend mengirim    →    Backend menerima    →    Hasil
─────────────────         ────────────────         ──────
"kontekstual"        →    key tidak dikenal   →    fallback ke formal_academic (diam-diam)
"humor_ringan"       →    key tidak dikenal   →    fallback ke formal_academic (diam-diam)
"cerita_narasi"      →    key tidak dikenal   →    fallback ke formal_academic (diam-diam)
```

Backend `_get_gaya_instruction()` hanya mengenal:
`light_story`, `formal_academic`, `case_study`, `standard_exam`, `hots`

Tidak ada satu pun dari keempat opsi UI yang match kecuali `formal_academic`.

**Dampak nyata:** Guru memilih "Humor Ringan" berharap soal lebih menarik untuk siswa SD, tapi soal yang keluar tetap kaku dan formal. Guru tidak tahu mengapa — tidak ada error, tidak ada warning.

**Fix:** Sinkronisasi array `gayaOptions` di frontend dengan `gaya_map` di backend. Ini one-to-one mapping yang seharusnya tidak pernah boleh berbeda.

---

### BUG-02: HOTS Tersembunyi — Fitur Utama Tidak Dapat Diakses

**Apa yang terjadi:**  
`hots` ada di backend `gaya_map` dan sudah punya instruksi yang dipersiapkan, tapi tidak ada satu pun entry point di UI untuk memilihnya. Satu-satunya referensi HOTS di frontend adalah label `'Campuran (HOTS)'` di dropdown difficulty — yang secara konseptual salah (lebih lanjut di Lapisan 2).

**Dampak nyata:** Guru yang ingin membuat soal HOTS untuk persiapan AKM atau ujian akhir tidak bisa melakukannya melalui UI. Fitur ini invisible.

---

### BUG-03: "AI Tier" Hardcoded — Informasi Menyesatkan

```tsx
// Baris terakhir di halaman — tidak pernah berubah
<p>AI Tier: Qwen 3.6 Plus</p>
```

Jika admin mengubah provider ke Groq atau GLM dari Settings, teks ini tetap menampilkan "Qwen 3.6 Plus". Guru yang tech-savvy akan kehilangan kepercayaan saat melihat informasi yang tidak konsisten.

**Fix:** Ambil nilai ini dari settings context/store yang sama dengan yang dipakai `ai_service.py`.

---

## Lapisan 2 — Konsep Pedagogis yang Kurang Tepat

### PEDAGOGI-01: Difficulty dan Level Kognitif Dicampur dalam Satu Input

**Apa yang terjadi:**

```tsx
const difficultyMap = {
    'Mudah':           'mudah',
    'Sedang':          'sedang',
    'Sulit':           'sulit',
    'Campuran (HOTS)': 'campuran',   // ← HOTS bukan difficulty
}
```

Ini adalah kesalahan konseptual yang cukup fundamental dari perspektif pedagogis. **HOTS (Higher Order Thinking Skills) bukan sinonim dari "sulit"** — ini adalah dimensi yang berbeda.

Contoh konkretnya:
- Soal C4 Analisis bisa mudah secara hitungan tapi menuntut penalaran tinggi
- Soal C1 Mengingat bisa terasa sulit jika materinya obscure

Mencampurkan keduanya membuat instruksi yang dikirim ke model menjadi ambigu. Model menerima `difficulty: 'campuran'` tapi tidak tahu apakah itu berarti distribusi mudah-sedang-sulit, atau instruksi untuk membuat soal HOTS.

**Yang seharusnya ada:** Dua input terpisah.

```
Tingkat Kesulitan                Level Kognitif (Taksonomi Bloom)
─────────────────                ────────────────────────────────
○ Mudah                          ☐ C1 — Mengingat      ]
○ Sedang           (terpisah)    ☐ C2 — Memahami       ] LOTS
○ Sulit                          ☐ C3 — Menerapkan     ]
○ Campuran                       ☐ C4 — Menganalisis   ]
                                 ☐ C5 — Mengevaluasi   ] HOTS
                                 ☐ C6 — Mencipta       ]
```

Guru bisa memilih difficulty "Sedang" dengan level kognitif "C4 + C5" — soal analisis yang tidak terlalu rumit secara konteks tapi menuntut penalaran tinggi. Kombinasi ini sangat umum dibutuhkan untuk ujian tengah semester Fase C-D.

---

### PEDAGOGI-02: Tidak Ada Panduan untuk Guru saat Memilih Parameter

Guru rata-rata tidak familiar dengan istilah teknis seperti "Fase A", "HOTS", atau bahkan "Tipe Soal: Campuran". UI saat ini menampilkan semua parameter tanpa konteks, membuat guru harus menebak-nebak apa yang harus dipilih.

Contoh yang perlu panduan inline:
- **Fase vs Kelas**: Guru terbiasa berpikir dalam "Kelas 4 SD", bukan "Fase B". Meskipun keduanya ada di form, tidak ada indikasi bahwa "Fase B = Kelas 3-4 SD".
- **Jumlah Soal**: Slider 1-50 tanpa rekomendasi. Guru tidak tahu apakah 20 soal cukup untuk 1 JP atau 2 JP.
- **Gaya Soal**: Tidak ada penjelasan apa bedanya "Studi Kasus" dengan "Cerita Narasi" dari perspektif hasil soal.

---

## Lapisan 3 — UX untuk Persona Guru

### UX-01: Step 2 (Filter) Terasa Kosong untuk Non-Modul

Ketika user memilih CP/ATP atau Topik Manual, Step 2 hanya menampilkan:

```
✓ Konteks Siap Digunakan
"Tidak ada filter halaman diperlukan untuk tipe sumber ini."
```

Dari perspektif guru: *"Kenapa saya harus klik Lanjut untuk melihat layar kosong?"*

Step 2 kehilangan fungsinya untuk 2 dari 3 tipe sumber. Ini menciptakan friction tanpa value.

**Opsi solusi:**
- Untuk CP/ATP: Gunakan Step 2 untuk menampilkan **preview hasil parsing** — tampilkan berapa TP yang terdeteksi, distribusi topik yang akan dijadikan soal, dan beri opsi untuk exclude TP tertentu.
- Untuk Topik Manual: Gunakan Step 2 untuk menampilkan **saran topik terkait** atau konfirmasi mata pelajaran yang relevan.
- Atau: Jadikan Step 2 conditional — hanya muncul untuk tipe "Modul PDF". Untuk tipe lain, langsung loncat ke Step 3.

---

### UX-02: Validasi Terlalu Minimal dan Terlambat

Saat ini validasi hanya terjadi di tombol "Lanjut" Step 1 — dan hanya mengecek apakah field kosong atau tidak. Tidak ada validasi konten.

Skenario yang tidak ter-handle:
- User paste CP/ATP dalam bahasa Inggris → backend tetap proses, soal keluar dalam bahasa Inggris
- User input jumlah soal 50 dengan modul PDF 2 halaman → AI tidak bisa memenuhi kuota, tapi user tidak diperingatkan
- User pilih Fase F (Kelas 12 SMA) tapi mata pelajaran "Matematika Kelas 1 SD" → tidak ada cross-validation

**Yang perlu ditambahkan:**
- Warning jika CP/ATP terlalu pendek (< 200 karakter) — kemungkinan besar tidak akan menghasilkan soal berkualitas
- Rekomendasi jumlah soal berdasarkan panjang konten yang diinput
- Cross-validation Fase vs Kelas — jika tidak sinkron, tampilkan warning

---

### UX-03: Summary Sebelum Generate Tidak Ada

Setelah mengisi 3 step dengan banyak parameter, user langsung klik "Generate Bank Soal Sekarang" tanpa ada ringkasan. Jika soal yang keluar tidak sesuai ekspektasi, guru tidak punya referensi apa yang sudah dia input.

**Yang dibutuhkan:** Panel ringkasan di bawah Step 3 atau sebagai overlay sebelum generate:

```
┌─ Ringkasan Konfigurasi ──────────────────────────────────┐
│  Sumber    : CP/ATP (523 karakter, 5 TP terdeteksi)      │
│  Mapel     : IPA — Fase C (Kelas 5-6 SD)                 │
│  Output    : 20 soal pilihan ganda + pembahasan          │
│  Gaya      : HOTS (C4 Analisis + C5 Evaluasi)            │
│  Provider  : Groq — Llama 3.3 70B                        │
└──────────────────────────────────────────────────────────┘
```

Ini juga membantu guru belajar parameter mana yang paling berpengaruh pada hasil soal.

---

### UX-04: Loading State Tidak Memberikan Konteks Waktu

```tsx
toast.loading("Mempersiapkan Bank Soal...", {
    description: "AI sedang menganalisis materi dan menyusun pertanyaan.",
})
```

Untuk 20 soal dengan pembahasan, proses bisa memakan waktu 15-45 detik tergantung provider. Guru yang tidak tahu ini akan mengira aplikasi hang dan mungkin me-refresh halaman.

**Yang dibutuhkan:** Estimasi waktu atau progress indicator yang lebih informatif:

```
⏳ Memproses 20 soal... (estimasi 20-30 detik)
   ████████░░░░░░░░░░░░  Menganalisis CP/ATP
```

Atau minimal: tampilkan nomor soal yang sedang diproses jika backend sudah support streaming.

---

### UX-05: Mobile Experience Berpotensi Bermasalah

Komponen yang perlu dicek di mobile:
- Slider jumlah soal (1-50) — sulit dikontrol dengan presisi di layar kecil, lebih baik diganti dengan input number + tombol +/-
- Grid 3 kolom source type di mobile sudah collapse ke 1 kolom ✅ tapi card masih cukup tinggi
- Step 2 iframe PDF preview di mobile — iframe 600px height di layar kecil akan sangat dominan dan sulit di-scroll

---

## Prioritas Perbaikan

```
HARUS sebelum launch:
  BUG-01  Sinkronisasi gaya soal frontend ↔ backend
  BUG-02  Tambahkan HOTS ke UI
  PEDAGOGI-01  Pisahkan difficulty dan level Bloom

SEBAIKNYA sebelum launch:
  UX-03  Tambahkan summary sebelum generate
  UX-01  Redesign Step 2 untuk non-modul
  BUG-03  Dinamiskkan AI Tier label

Backlog (post-launch):
  PEDAGOGI-02  Panduan inline per parameter
  UX-02  Validasi konten dan cross-validation
  UX-04  Loading state dengan estimasi waktu
  UX-05  Mobile optimization slider
```

---

## Catatan untuk Product Owner

Semua masalah di atas berpusat pada satu pertanyaan: **siapa yang salah ketika soal yang keluar tidak sesuai harapan guru?**

Saat ini, jika guru memilih "Humor Ringan" dan soal tetap formal, atau memilih HOTS tapi dapat soal C1 — guru akan menyalahkan AI-nya. Padahal akar masalahnya ada di layer input yang tidak menyampaikan instruksi dengan benar ke backend.

Memperbaiki form ini bukan sekadar UX improvement — ini adalah **akurasi fungsional** dari produk. Form yang baik adalah yang memastikan apa yang guru pilih adalah apa yang AI terima.