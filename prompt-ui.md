# UI Prompt - Dashboard & Soal Generator

> **Purpose:** Panduan desain UI/UX untuk implementasi frontend
> **Scope:** Dashboard, Sidebar, List Soal, Generate Soal, Edit Soal

---

## 1. Layout Utama

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  [☰] Soal AI Generator                    [⚙ Settings] [👤]    │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│   SIDEBAR    │              MAIN CONTENT                        │
│              │                                                  │
│  ┌────────┐  │  ┌────────────────────────────────────────────┐ │
│  │ 📊     │  │  │                                            │ │
│  │Dashboard│  │  │                                            │ │
│  ├────────┤  │  │                                            │ │
│  │ 📝     │  │  │                                            │ │
│  │Soal    │  │  │                                            │ │
│  │        │  │  │          (Halaman Aktif)                   │ │
│  │ [+Tambah]│ │  │                                            │ │
│  ├────────┤  │  │                                            │ │
│  │ 📚     │  │  │                                            │ │
│  │Modul   │  │  │                                            │ │
│  │ Ajar   │  │  │                                            │ │
│  ├────────┤  │  │                                            │ │
│  │ 📄     │  │  │                                            │ │
│  │Template│  │  │                                            │ │
│  │ Word   │  │  │                                            │ │
│  └────────┘  │  └────────────────────────────────────────────┘ │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## 2. Sidebar

### 2.1 Struktur Sidebar

```
┌─────────────────────────────┐
│  📝 SOAL                    │
│  ─────────────────────────  │
│                             │
│  [+ Tambah Soal]            │
│                             │
│  ▼ Soal Terbaru             │
│  ┌───────────────────────┐ │
│  │ 20 PG - Matematika    │ │
│  │ Aljabar               │ │
│  │ Draft · 2 Apr         │ │
│  ├───────────────────────┤ │
│  │ 15 Isian - IPA        │ │
│  │ Fotosintesis          │ │
│  │ Finalized · 1 Apr     │ │
│  ├───────────────────────┤ │
│  │ 10 Essay - B. Indo    │ │
│  │ Teks Eksposisi        │ │
│  │ Draft · 31 Mar        │ │
│  └───────────────────────┘ │
│                             │
│  📚 MODUL AJAR              │
│  ─────────────────────────  │
│  ┌───────────────────────┐ │
│  │ Matematika Kls 7      │ │
│  │ IPA Kls 9             │ │
│  │ B. Indo Kls 10        │ │
│  └───────────────────────┘ │
│                             │
│  📄 TEMPLATE WORD           │
│  ─────────────────────────  │
│  ┌───────────────────────┐ │
│  │ Default               │ │
│  │ Kop Sekolah           │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

### 2.2 Sidebar - Menu Items

| Menu | Icon | Route | Keterangan |
|------|------|-------|------------|
| Dashboard | 📊 | `/` | Ringkasan & quick actions |
| Soal | 📝 | `/soal` | List semua soal (aktif default) |
| + Tambah Soal | ➕ | `/soal/generate` | Tombol CTA di dalam section Soal |
| Modul Ajar | 📚 | `/modul` | Kelola modul ajar yang di-upload |
| Template Word | 📄 | `/template` | Kelola template Word |

### 2.3 Sidebar - List Soal (Expandable)

```
📝 Soal                    [Collapse/Expand]
│
├── [+ Tambah Soal]        → Link ke /soal/generate
│
├── ▼ Soal Terbaru         → Group by status/waktu
│   │
│   ├── 20 PG - Matematika Aljabar
│   │   ├── Status: Draft (badge kuning)
│   │   ├── Tanggal: 2 Apr 2026
│   │   └── Klik → Navigate ke /soal/edit/:id
│   │
│   ├── 15 Isian - IPA Fotosintesis
│   │   ├── Status: Finalized (badge hijau)
│   │   ├── Tanggal: 1 Apr 2026
│   │   └── Klik → Navigate ke /soal/edit/:id
│   │
│   └── 10 Essay - B. Indo Teks Eksposisi
│       ├── Status: Draft (badge kuning)
│       ├── Tanggal: 31 Mar 2026
│       └── Klik → Navigate ke /soal/edit/:id
│
└── [Lihat Semua →]       → Navigate ke /soal
```

### 2.4 Sidebar - Item Soal (Komponen)

```tsx
interface SidebarSoalItem {
  id: string;
  judul: string;           // "20 PG - Matematika Aljabar"
  mataPelajaran: string;   // "Matematika"
  topik: string;           // "Aljabar"
  tipeSoal: string;        // "pilihan_ganda"
  jumlahSoal: number;      // 20
  status: 'draft' | 'finalized';
  createdAt: Date;
  modulId?: string;        // linked modul (optional)
}
```

**Visual per item:**
```
┌───────────────────────────────────┐
│ 20 PG - Matematika Aljabar        │
│ [Draft] · 2 Apr 2026              │
└───────────────────────────────────┘
```

- **Active state:** Background biru muda, border kiri biru
- **Hover state:** Background abu-abu muda
- **Status badge:**
  - Draft → Kuning (`bg-yellow-100 text-yellow-800`)
  - Finalized → Hijau (`bg-green-100 text-green-800`)

---

## 3. Halaman Dashboard (`/`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ 📝 Total    │  │ 📚 Modul    │  │ 📄 Template │            │
│  │ Soal: 15    │  │ Ajar: 8     │  │ Word: 3     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ⚡ Quick Actions                                          │ │
│  │                                                           │ │
│  │  [+ Generate Soal Baru]  [+ Upload Modul Ajar]           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📝 Soal Terakhir                                          │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 20 PG - Matematika Aljabar                          │ │ │
│  │  │ [Draft] · Dari modul: Matematika Kls 7              │ │ │
│  │  │ [Edit] [Download] [Hapus]                           │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 15 Isian - IPA Fotosintesis                         │ │ │
│  │  │ [Finalized] · Dari modul: IPA Kls 9                 │ │ │
│  │  │ [Edit] [Download] [Hapus]                           │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📚 Modul Ajar Terbaru                                     │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Matematika Kelas 7 - Aljabar                        │ │ │
│  │  │ Uploaded: 2 Apr 2026 · 15 halaman                   │ │ │
│  │  │ [Generate Soal] [Lihat]                             │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Halaman Generate Soal (`/soal/generate`)

### 4.1 Form Generate

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Kembali    Generate Soal Baru                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Sumber Materi ────────────────────────────────────────────┐│
│  │                                                            ││
│  │  (•) Dari Modul Ajar    ( ) Buat Manual                   ││
│  │                                                            ││
│  │  Pilih Modul: [Matematika Kls 7 - Aljabar ▼]              ││
│  │  📄 Preview modul: 15 halaman, 4500 kata                  ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Konfigurasi Soal ─────────────────────────────────────────┐│
│  │                                                            ││
│  │  Mata Pelajaran: [Matematika ▼]  ← Auto-fill dari modul   ││
│  │  Topik/Kompetensi: [Persamaan Linear Satu Variabel]        ││
│  │                                                            ││
│  │  Tipe Soal:                                                ││
│  │  (•) Pilihan Ganda  ( ) Isian  ( ) Essay  ( ) Campuran    ││
│  │                                                            ││
│  │  Jumlah Soal: [────20────]  (min 1, max 100)              ││
│  │                                                            ││
│  │  Tingkat Kesulitan: [Sedang ▼]                            ││
│  │  [Mudah] [Sedang] [Sulit] [Campuran]                      ││
│  │                                                            ││
│  │  ☑ Sertakan Pembahasan                                    ││
│  │  ☑ Sertakan Kunci Jawaban                                 ││
│  │  ☐ Sertakan Gambar Pendukung                              ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Preview Prompt (Opsional) ────────────────────────────────┐│
│  │ ℹ️ Soal akan di-generate berdasarkan konten modul:         ││
│  │ "Matematika Kelas 7 - Aljabar"                             ││
│  │ AI akan membaca materi tentang persamaan linear dan        ││
│  │ membuat soal yang relevan dengan konten tersebut.          ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [🚀 Generate Soal]                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Loading State

```
┌─────────────────────────────────────────────────────────────────┐
│  Generate Soal Baru                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⏳ Sedang generate soal...                                     │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░  75%                     │
│                                                                 │
│  📖 Membaca modul ajar... ✓                                    │
│  🧠 Menganalisis konten... ✓                                   │
│  ✍️  Membuat soal...                                          │
│  ✅ Menyimpan ke database...                                   │
│                                                                 │
│  Estimasi: ~15 detik                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Halaman List Soal (`/soal`)

```
┌─────────────────────────────────────────────────────────────────┐
│  📝 Daftar Soal                    [+ Generate Soal Baru]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filter:                                                        │
│  [Semua Status ▼] [Semua Mapel ▼] [Cari soal...]               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 20 PG - Matematika Aljabar                                │ │
│  │ [Draft] · Matematika · Dari: Matematika Kls 7             │ │
│  │ 20 soal · 2 Apr 2026                                      │ │
│  │ [✏️ Edit] [📥 Download] [🗑 Hapus]                        │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 15 Isian - IPA Fotosintesis                               │ │
│  │ [Finalized] · IPA · Dari: IPA Kls 9                       │ │
│  │ 15 soal · 1 Apr 2026                                      │ │
│  │ [✏️ Edit] [📥 Download] [🗑 Hapus]                        │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 10 Essay - B. Indo Teks Eksposisi                         │ │
│  │ [Draft] · B. Indonesia · Tanpa modul (manual)             │ │
│  │ 10 soal · 31 Mar 2026                                     │ │
│  │ [✏️ Edit] [📥 Download] [🗑 Hapus]                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Showing 1-3 of 15   [< Prev] [1] [2] [3] [4] [5] [Next >]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Halaman Edit Soal (`/soal/edit/:id`)

### 6.1 Layout Editor

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Kembali    Edit Soal - 20 PG Matematika Aljabar              │
│                                                                 │
│  [💾 Simpan Semua]  [🔄 Generate Ulang]  [📥 Download Word]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Toolbar ──────────────────────────────────────────────────┐│
│  │ ☑ Tampilkan Kunci Jawaban                                 ││
│  │ ☑ Tampilkan Pembahasan                                    ││
│  │ [📥 Export Kunci Jawaban Terpisah]                         ││
│  │                                                            ││
│  │  Filter: [Semua] [Belum Diedit] [Sudah Diedit]            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ── Soal 1 dari 20 ────────────────────────────────────────── │
│                                                                 │
│  Pertanyaan:                                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Hasil dari 2x + 3 = 11 adalah ...                        │ │
│  │                                                          │ │
│  │ [📎 Tambah Gambar]                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Pilihan Jawaban:                                              │
│  ○ A. [x = 2                                  ]               │
│  ● B. [x = 4                                  ]  ← Kunci      │
│  ○ C. [x = 6                                  ]               │
│  ○ D. [x = 8                                  ]               │
│  [+ Tambah Pilihan]                                            │
│                                                                 │
│  Kunci Jawaban: [B ▼]                                          │
│                                                                 │
│  Pembahasan:                                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 2x + 3 = 11                                              │ │
│  │ 2x = 11 - 3                                              │ │
│  │ 2x = 8                                                   │ │
│  │ x = 4                                                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [↑ Pindah Naik] [↓ Pindah Turun] [🗑 Hapus Soal]             │
│                                                                 │
│  ──────────────────────────────────────────────────────────── │
│  [< Prev]  Soal 1/20  [Next >]    [+ Tambah Soal Baru]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Komponen per Soal

```tsx
interface SoalItem {
  nomor: number;
  pertanyaan: string;
  tipe: 'pilihan_ganda' | 'isian' | 'essay';
  pilihan?: string[];        // untuk PG
  kunciJawaban: string;      // "B" untuk PG, teks langsung untuk isian/essay
  pembahasan?: string;
  gambarUrl?: string;
  isEdited: boolean;         // track apakah sudah diedit
}
```

### 6.3 State Indikator

| State | Visual |
|-------|--------|
| Baru generate | Border hijau muda, badge "New" |
| Sudah diedit | Border biru muda, badge "Edited" |
| Belum diedit | Border abu-abu |
| Ada perubahan belum saved | Dot orange di nomor soal |

---

## 7. Halaman Download Preview (`/soal/edit/:id/preview`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Preview Word - 20 PG Matematika Aljabar                        │
│                                                                 │
│  [📥 Download .docx]  [← Kembali ke Editor]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              KOP SEKOLAH                            │ │ │
│  │  │         (dari template Word)                        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  SOAL ULANGAN HARIAN                                     │ │
│  │  Mata Pelajaran: Matematika                              │ │
│  │  Kelas: VII                                              │ │
│  │  Topik: Aljabar - Persamaan Linear                       │ │
│  │  Hari/Tanggal: ....................                       │ │
│  │                                                           │ │
│  │  ─────────────────────────────────────────────────────   │ │
│  │                                                           │ │
│  │  1. Hasil dari 2x + 3 = 11 adalah ...                    │ │
│  │     a. x = 2        c. x = 6                             │ │
│  │     b. x = 4        d. x = 8                             │ │
│  │                                                           │ │
│  │  2. Jika 3x - 5 = 10, maka nilai x adalah ...            │ │
│  │     a. x = 3        c. x = 7                             │ │
│  │     b. x = 5        d. x = 9                             │ │
│  │                                                           │ │
│  │  ... (selanjutnya)                                       │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Prinsip Desain

### 8.1 Fokus: Soal Berdasarkan Konteks Modul

**PRINSIP UTAMA:** Soal TIDAK BOLEH halusinasi. Setiap soal harus berdasarkan konten modul ajar yang di-upload.

**Implementasi di UI:**

1. **Saat generate dari modul:**
   - Tampilkan badge "📖 Berdasarkan Modul: [Nama Modul]"
   - Tampilkan preview teks modul yang akan dikirim ke AI
   - User bisa edit/konten modul yang dipakai sebelum generate

2. **Saat generate manual (tanpa modul):**
   - Warning banner: "⚠️ Mode manual - Soal akan di-generate berdasarkan pengetahuan AI, bukan modul spesifik"
   - User wajib isi mata pelajaran + topik secara manual
   - Rekomendasi: "💡 Untuk hasil lebih akurat, upload modul ajar terlebih dahulu"

3. **Di editor soal:**
   - Tampilkan sumber soal: "Dari modul: [nama]" atau "Manual (tanpa modul)"
   - Tombol "📖 Lihat Konten Sumber" → modal showing teks modul yang jadi referensi

### 8.2 Anti-Hallucination UX

```
┌─────────────────────────────────────────────────────────────────┐
│  ℹ️ Sumber Soal                                                 │
│  ───────────────────────────────────────────────────────────── │
│  Soal ini di-generate berdasarkan modul:                        │
│  📄 "Matematika Kelas 7 - Aljabar"                              │
│                                                                 │
│  Konten yang digunakan AI:                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ "Persamaan linear satu variabel adalah kalimat terbuka    │ │
│  │  yang dihubungkan dengan tanda sama dengan (=) dan hanya  │ │
│  │  mempunyai satu variabel dengan pangkat satu..."          │ │
│  │                                                           │ │
│  │  [Baca selengkapnya →]                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [✏️ Edit Soal]  [🔄 Generate Ulang dari Modul]                │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Component Library

| Komponen | Library | Keterangan |
|----------|---------|------------|
| UI Components | shadcn/ui | Clean, customizable |
| Icons | Lucide React | Konsisten dengan shadcn |
| Tables | TanStack Table | Sorting, filtering, pagination |
| Forms | React Hook Form + Zod | Validation |
| Toast | Sonner | Notifikasi |
| Dialog/Modal | shadcn/ui Dialog | Konfirmasi, preview |
| Sidebar | Custom + Tailwind | Lightweight |
| Text Editor | TipTap atau ContentEditable | Edit soal rich text |

### 8.4 Color Scheme

```
Primary:    #3B82F6 (blue-500)   → Buttons, links, active states
Secondary:  #64748B (slate-500)  → Text secondary, borders
Success:    #22C55E (green-500)  → Finalized, save success
Warning:    #F59E0B (amber-500)  → Draft, unsaved changes
Danger:     #EF4444 (red-500)    → Delete, errors
Background: #F8FAFC (slate-50)   → Page background
Surface:    #FFFFFF (white)      → Cards, panels
```

### 8.5 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Sidebar collapsible (hamburger), single column |
| Tablet (768-1024px) | Sidebar mini (icon only), main content |
| Desktop (> 1024px) | Sidebar full, two-column editor |

---

## 9. Navigation Flow

```
Dashboard (/)
  │
  ├── [+ Generate Soal Baru] ──→ /soal/generate
  │                                  │
  │                                  ├── Success ──→ /soal/edit/:id
  │                                  │
  │                                  └── Cancel ──→ /soal
  │
  ├── [Edit] ──→ /soal/edit/:id
  │                  │
  │                  ├── [Download Word] ──→ Download file
  │                  │
  │                  ├── [Preview] ──→ /soal/edit/:id/preview
  │                  │
  │                  └── [Save] ──→ Stay + toast
  │
  └── [Upload Modul] ──→ /modul/upload
                              │
                              └── Success ──→ /modul
```

---

## 10. State Management

### 10.1 Global State (Zustand)

```ts
interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Soal
  soalList: SoalSummary[];
  currentSoal: SoalDetail | null;
  isLoading: boolean;

  // Generate
  generateConfig: GenerateConfig;
  isGenerating: boolean;
  generateProgress: number;

  // Editor
  editedSoal: SoalItem[];
  hasUnsavedChanges: boolean;

  // Modul
  modulList: ModulSummary[];
}
```

### 10.2 Server State (React Query)

```ts
// Queries
useModulList()
useModulDetail(id)
useSoalList()
useSoalDetail(id)
useTemplateList()

// Mutations
useCreateModul()
useGenerateSoal()
useUpdateSoal()
useDeleteSoal()
useDownloadWord()
```

---

## 11. Error States

### 11.1 Generate Gagal

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ Generate Soal Gagal                                         │
│                                                                 │
│  Penyebab: API Gemini sedang rate limit (15 req/min)           │
│                                                                 │
│  Solusi:                                                        │
│  • Tunggu 1-2 menit lalu coba lagi                             │
│  • Kurangi jumlah soal                                         │
│  • Pastikan API key sudah benar                                │
│                                                                 │
│  [🔄 Coba Lagi]  [← Kembali]                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Modul Gagal Diparse

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ Gagal Membaca Modul                                         │
│                                                                 │
│  File "modul.pdf" tidak bisa diparse otomatis.                 │
│                                                                 │
│  Kemungkinan penyebab:                                          │
│  • File terproteksi password                                    │
│  • File berupa gambar scan (perlu OCR)                         │
│  • Format file tidak didukung                                   │
│                                                                 │
│  Alternatif:                                                    │
│  • Copy-paste teks modul secara manual                         │
│  • Upload file dengan format berbeda (.docx)                   │
│                                                                 │
│  [📋 Input Manual]  [📁 Upload Ulang]  [← Batal]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Checklist Implementasi UI

### Phase 1 - Core UI
- [ ] Layout utama (Header + Sidebar + Content)
- [ ] Sidebar dengan navigasi + list soal
- [ ] Halaman Dashboard
- [ ] Halaman Generate Soal (form lengkap)
- [ ] Halaman List Soal (dengan filter & pagination)
- [ ] Halaman Edit Soal (inline editor)
- [ ] Preview Word
- [ ] Download .docx
- [ ] Loading states
- [ ] Error states
- [ ] Toast notifications
- [ ] Responsive design

### Phase 2 - Polish
- [ ] Drag & drop reorder soal
- [ ] Auto-save indicator
- [ ] Unsaved changes warning
- [ ] Keyboard shortcuts (Ctrl+S, Ctrl+Z)
- [ ] Dark mode
- [ ] Export kunci jawaban terpisah
- [ ] Batch operations (hapus banyak, finalize banyak)
