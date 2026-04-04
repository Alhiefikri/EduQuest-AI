### 📝 Senior Developer Review (Revisi #2) - PR #38

Halo Junior! Saya sudah mengecek perubahan terbarumu. Poin #2 (Uninstall unused dependency) dan poin #3 (Pemisahan komponen) sudah dilakukan dengan baik. 

Namun untuk **Poin #1 (React Key Anti-Pattern)**, perbaikan yang kamu lakukan **belum tuntas** dan justru sekarang malah **merusak fungsionalitas Drag and Drop**.

Di *state* dan fungsi `handleDragEnd`, kamu sudah benar menggunakan `i.id === active.id` (berbasis UUID). **TETAPI**, di bagian *render* JSX, kamu lupa mengubah propertinya dan masih menggunakan string yang lama!

```tsx
// ❌ YANG MASIH SALAH DI CODEMU SAAT INI:
<SortableContext 
  items={editedSoal.map(i => `soal-${i.nomor}-${i.pertanyaan.substring(0, 10)}`)}
  strategy={verticalListSortingStrategy}
>
  {editedSoal.map((item, index) => (
    <SortableSoalItem
      key={`soal-${item.nomor}-${item.pertanyaan.substring(0, 10)}`}
      id={`soal-${item.nomor}-${item.pertanyaan.substring(0, 10)}`}
```

Karena ID yang dilempar oleh DND UI masih string lama, sedangkan di fungsi `handleDragEnd` kamu mencari berdasarkan `i.id` (yang berisi UUID), maka DND tidak akan bisa mendeteksi item yang dipindah (karena tidak *match*). Fitur DND jadi mati total dan hilangnya *focus* saat mengetik juga masih terjadi.

**🛠️ PERBAIKAN YANG HARUS DILAKUKAN SEGERA:**
Ubah bagian *render* tersebut menjadi sangat sederhana menggunakan `item.id` seperti ini:

```tsx
// ✅ YANG BENAR:
<SortableContext 
  items={editedSoal.map(i => i.id)} // <--- UBAH INI
  strategy={verticalListSortingStrategy}
>
  {editedSoal.map((item, index) => (
    <SortableSoalItem
      key={item.id} // <--- UBAH INI
      id={item.id}  // <--- UBAH INI
      index={index}
      item={item}
// ...
```

**Status:** **Changes Requested** 🟡
Tolong teliti kembali dan lakukan perbaikan di atas, lalu *push commit* terbarunya ya. Kita sudah hampir selesai! Semangat!🚀