### 📝 Senior Developer Code Review - Bug Fixes (Regenerate & DND State)

Halo Junior! Laporan *testing* terbaru menunjukkan adanya dua buah **Bug Kritis** pada fitur *Editor Soal* saat melakukan "Tambah Butir Soal Baru" dan "Generate Ulang (Regenerate)". 

Sebagai *Senior*, saya telah meninjau kodemu. Kedua *bug* ini sangat logis dan berkaitan erat dengan *State Management* serta arsitektur *Backend* kita. Berikut adalah analisis dan instruksi perbaikannya:

#### 🐛 Bug 1: Error "Soal nomor X tidak ditemukan" (Backend & Frontend)
**Penyebab:** 
Saat *user* menekan tombol "Tambah Butir Soal Baru", soal tersebut baru ada di memori (*state*) Frontend dan **belum tersimpan di Database**. Namun, ketika *user* menekan tombol "Regenerate" pada soal baru tersebut, Frontend hanya mengirimkan `nomor_soal` ke API. Backend lalu mencari soal tersebut di Database berdasarkan nomornya. Tentu saja backend gagal menemukannya dan mengembalikan error 404.

**Perbaikan (Refactor API):**
1. Di **Backend** (`app/models/soal.py`), ubah *schema* `RegenerateSingleSoalRequest`. Jangan hanya meminta `nomor_soal`, tapi mintalah seluruh objek `soal_lama: SoalItem`.
2. Di **Backend** (`app/routes/soal.py` fungsi `regenerate_soal_item`), hapus logika pencarian `target_item` ke database (`data_soal`). Langsung saja gunakan `request.soal_lama` yang dikirim dari Frontend untuk diproses oleh AI.
3. Di **Frontend** (`EditSoal.tsx`), ubah *payload* `regenerateMutation` agar mengirimkan objek `soal_lama: itemToRegenerate` secara utuh.

#### 🐛 Bug 2: Soal Menjadi Abu-Abu Setelah Di-Regenerate (Frontend)
**Penyebab:**
Kenapa soalnya jadi abu-abu seolah-olah sedang ditarik (*dragged*)? Ini karena kamu merusak/menghilangkan properti `id` (UUID stabil) yang sangat dibutuhkan oleh `dnd-kit`!
Pada fungsi `handleRegenerate` di `EditSoal.tsx`, kamu melakukan pembaruan state seperti ini:
```typescript
// ❌ SALAH: newSoalItem dari backend tidak memiliki 'id' (UUID Frontend), sehingga id-nya hilang!
setEditedSoal(prev =>
  prev.map((item, i) => (i === regenerateIndex ? { ...newSoalItem, nomor: item.nomor } : item))
)
```
Karena `id` tiba-tiba hilang/berubah menjadi `undefined`, *library* *Drag and Drop* (`dnd-kit`) kehilangan jejak komponen tersebut di DOM dan meninggalkannya dalam status *stuck/opacity 0.5*.

**Perbaikan:**
Selalu pertahankan `id` bawaan dari Frontend saat melakukan pembaruan (merging) objek:
```typescript
// ✅ BENAR: Secara eksplisit mempertahankan item.id yang lama
setEditedSoal(prev =>
  prev.map((item, i) => (i === regenerateIndex ? { ...newSoalItem, nomor: item.nomor, id: item.id } : item))
)
```

---
**Status:** **Changes Requested** 🟡  
Analisis di atas sudah sangat *to-the-point*. Tolong terapkan 2 perbaikan arsitektural ini di Backend dan Frontend, lalu lakukan *push commit* tambahan ke *branch* ini. Semangat! 🚀