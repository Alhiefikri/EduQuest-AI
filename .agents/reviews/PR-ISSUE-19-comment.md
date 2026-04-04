### 📝 Senior Developer Code Review - PR #38

Halo Junior! Kerja bagus. Secara fungsionalitas utama (Sidebar Collapsible, Drag and Drop, dan Fix Numbering Bug) sudah berjalan dengan baik.

Saya sangat mengapresiasi inisiatifmu memindahkan komponen **Regenerate Modal** keluar dari fungsi `.map()`. Ini adalah penerapan prinsip **DRY (Don't Repeat Yourself)** yang sangat baik karena mencegah React menumpuk *render* puluhan komponen modal yang sama ke dalam DOM! 🚀

Namun, sebelum saya *Approve* PR ini, ada beberapa isu terkait **Clean Code** dan potensi **Bug React (Anti-Pattern)** yang kritis dan harus segera diperbaiki:

#### ❌ 1. React Key Anti-Pattern (CRITICAL BUG)
Di file `frontend/src/pages/EditSoal.tsx`, kamu menggunakan kombinasi nomor dan teks pertanyaan sebagai `key` dan `id` untuk DND:
```tsx
id={`soal-${item.nomor}-${item.pertanyaan.substring(0, 10)}`}
```
**Kenapa ini salah?** Jika *user* mengetik dan mengedit teks pertanyaan pada 10 karakter pertama, ID ini otomatis berubah secara *real-time*! Akibatnya, React akan menganggap itu adalah elemen UI baru. React akan melakukan *Unmount & Remount* komponen tersebut, dan *user* akan **kehilangan fokus kursor (input focus loss)** di tengah-tengah mengetik.
**Perbaikan:** Berikan ID unik (gunakan `crypto.randomUUID()` atau penanda *unique string* lainnya) pada objek `SoalItem` di dalam *state* saat pertama kali data di-load (di dalam `useEffect`) atau saat menekan "Tambah Butir Soal Baru". Gunakan ID unik yang stabil tersebut sebagai properti `id` untuk DND dan `key` untuk `.map()`.

#### ❌ 2. Unused Dependencies (Code Smell)
Saya melihat kamu menambahkan `@hello-pangea/dnd` di file `package.json`, tetapi implementasi aslinya kamu menggunakan library `@dnd-kit/core`.
**Perbaikan:** Tolong jalankan `npm uninstall @hello-pangea/dnd` agar *bundle size* aplikasi kita tidak membengkak dengan *dependency* sampah.

#### ⚠️ 3. Pemisahan Komponen (Clean Code)
File `EditSoal.tsx` saat ini menjadi sangat panjang karena kamu mendeklarasikan seluruh komponen `<SortableSoalItem />` yang memiliki ratusan baris di file yang sama dengan komponen halamannya (*Page*).
**Perbaikan:** Buat file baru di `frontend/src/components/SortableSoalItem.tsx`, lalu pindahkan logika UI kartu soal (termasuk tombol Up/Down dan Regenerate) ke sana. *Import* komponen itu ke dalam `EditSoal.tsx`. Ini akan membuat kode menjadi lebih modular dan jauh lebih mudah dibaca/di-maintain.

---
**Status:** **Changes Requested** 🟡
Tolong kerjakan 3 poin di atas dengan membuat *commit* tambahan (*push* ke *branch* yang sama di PR ini). Beri tahu saya jika kamu sudah siap untuk di-review ulang! Semangat!