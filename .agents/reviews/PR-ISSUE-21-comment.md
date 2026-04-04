### 📝 Senior Developer Code Review - PR #42 (Stepper UI & PDF Filtering)

Halo Junior! Kerja bagus dalam mengimplementasikan logika *Backend* (`PyMuPDF` ekstraksi berdasarkan rentang halaman) dan struktur *Frontend* dengan sistem *Stepper* 3 langkah. Saya juga mengapresiasi kamu telah menambahkan fitur `CP / ATP` dan `iframe` PDF sesuai instruksi!

Namun, berdasarkan keluhan mengenai "IDE Problems" dan hasil *build* (Type Check), ada banyak *Warning* dan *Error* dari TypeScript (TS) yang merusak *Clean Code* kita. Selain itu, kamu tanpa sengaja **MENGHAPUS** beberapa fitur penting di *Step 3*!

Tolong perbaiki poin-poin berikut di *branch* ini:

#### ❌ 1. Fitur Penting Hilang di Step 3 (CRITICAL)
Saat kamu memindahkan UI ke *Step 3*, kamu tanpa sengaja menghapus komponen untuk **Tingkat Kesulitan**, **Gaya Soal (Multi-Select)**, dan opsi **Halaman Kunci Jawaban**. 
Inilah alasan utama kenapa IDE-mu mengeluh bahwa variabel `setDifficulty`, `setGayaSoal`, dan `setIncludeKunci` menjadi *unused variable* (tidak terpakai).
**Perbaikan:** Kembalikan (*restore*) komponen UI dropdown "Tingkat Kesulitan", *checkbox* "Gaya Soal", dan *toggle* "Halaman Kunci Jawaban" ke dalam tampilan **Step 3 (AI Parameters)** di `GenerateSoal.tsx`.

#### 🧹 2. Bersihkan Unused Variables / Imports (IDE Errors)
Ada banyak komponen dan variabel yang di-*import* atau dideklarasikan tapi tidak pernah digunakan. Hal ini membuat proses *build* gagal.
**Perbaikan:** Hapus variabel/import yang tidak terpakai di file berikut:
- `src/hooks/useSoal.ts` (Hapus import `SoalItem` jika tidak dipakai)
- `src/pages/DaftarSoal.tsx` (Hapus import `MoreVertical`)
- `src/pages/Dashboard.tsx` (Hapus import `CardDescription`, dan state yang tidak dipakai: `UploadModal`, `uploadDocument`, `isUploading`, `uploadOpen`)
- `src/pages/GenerateSoal.tsx` (Hapus import `SlidersHorizontal`, `Label`)
- `src/pages/ModulAjar.tsx` (Hapus import `MoreVertical`, `Filter`)
- `src/pages/Settings.tsx` (Hapus *state* `loaded` jika tidak dipakai untuk rendering)

#### 🔧 3. Error React Router (App.tsx)
Ada error di `App.tsx`: `Object literal may only specify known properties, and 'v7_startTransition' does not exist...`
**Perbaikan:** Buka file `src/App.tsx` dan hapus konfigurasi `v7_startTransition` pada bagian *future flags* milik `react-router-dom`, karena sepertinya versi router yang kita gunakan tidak/belum mendukungnya.

---
**Status:** **Changes Requested** 🟡  
Secara logika aplikasi, kamu sudah luar biasa! Namun untuk menjaga standar profesional, *Clean Code*, dan menghilangkan garis merah di IDE, tolong eksekusi 3 perbaikan di atas dan *push commit* tambahanmu. Semangat! 🚀