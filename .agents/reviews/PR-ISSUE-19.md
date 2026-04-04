# Pull Request Review untuk [ISSUE-19] UI/UX Enhancements & Generation Bug Fixes (PR #38)

**Reviewer:** Senior Developer Agent
**Status PR:** 🟡 REQUEST CHANGES (Butuh Revisi)

Halo Junior Agent, kerja bagus! Secara fungsionalitas utama (Sidebar Collapsible, Drag and Drop, dan Fix Numbering Bug) sudah berjalan sesuai dengan *Acceptance Criteria*. 

Saya sangat mengapresiasi inisiatifmu memindahkan komponen **Regenerate Modal** keluar dari fungsi `.map()`. Ini adalah penerapan prinsip **DRY (Don't Repeat Yourself)** yang sangat baik karena mencegah React me-render puluhan modal yang sama di DOM.

Namun, sebelum saya *Approve* dan *Merge* PR ini ke `main`, ada beberapa isu terkait *Clean Code* dan stabilitas React yang harus kamu perbaiki:

### ❌ 1. React Key Anti-Pattern (CRITICAL)
Di file `EditSoal.tsx`, kamu menggunakan kombinasi nomor dan teks pertanyaan sebagai `key` dan `id` untuk DND:
```typescript
id={`soal-${item.nomor}-${item.pertanyaan.substring(0, 10)}`}
```
**Masalah:** Ini sangat berbahaya. Jika user sedang mengetik dan mengedit teks pertanyaan pada 10 karakter pertama, ID ini akan berubah! Akibatnya, React akan menganggap itu adalah komponen baru, melakukan *Unmount & Remount*, dan user akan **kehilangan fokus kursor (input focus loss)** saat mengetik.
**Solusi:** Berikan ID unik (UUID atau *unique string* generator) pada setiap objek `SoalItem` di dalam *state* saat pertama kali di-load atau saat user mengklik "Tambah Soal". Gunakan ID unik yang stabil tersebut sebagai `key` dan `id` DND.

### ❌ 2. Unused Dependencies (Code Smell)
Saya melihat kamu menginstall `@hello-pangea/dnd` di `package.json` tetapi kode implementasinya menggunakan `@dnd-kit/core`.
**Solusi:** Tolong *uninstall* *package* yang tidak terpakai agar *bundle size* aplikasi kita tetap ringan. Jalankan `npm uninstall @hello-pangea/dnd` di terminal frontend.

### ⚠️ 3. Pemisahan Komponen (Clean Code)
File `EditSoal.tsx` menjadi sangat panjang karena kamu mendeklarasikan komponen `<SortableSoalItem />` yang memiliki ratusan baris di dalam file yang sama dengan komponen *Page*.
**Solusi:** Buat file baru di `frontend/src/components/SortableSoalItem.tsx`, lalu pindahkan komponen tersebut ke sana. *Import* komponen itu ke dalam `EditSoal.tsx`. Ini akan membuat kode jauh lebih mudah dibaca dan di-maintenance.

---
**Instruksi Selanjutnya:**
Tolong buat *commit* perbaikan untuk 3 poin di atas pada *branch* yang sama, lalu beri tahu saya jika sudah siap untuk di-review ulang. Semangat!
