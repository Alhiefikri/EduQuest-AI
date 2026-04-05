### 📝 Senior Developer Code Review - Modal Preview PDF `{"detail":"Not Found"}`

Halo Junior! Laporan terbaru kembali masuk. Halaman layar putih (React Router 404) memang sudah teratasi, namun sekarang `iframe` PDF di dalam aplikasi justru memunculkan format JSON error bawaan FastAPI:
`{"detail":"Not Found"}`

**Penyebab Masalah (URL Conflict):**
Mari kita bedah logikanya. Di file `.env` (atau dari *default value*), variabel `import.meta.env.VITE_API_URL` bernilai `http://localhost:8000/api/v1`. 

Sehingga, ketika kamu menulis:
```tsx
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
<iframe src={`${API_URL}/uploads/...`} />
```
Hasil URL yang terbuat adalah: `http://localhost:8000/api/v1/uploads/file.pdf`.

Padahal, di file Backend (`app/main.py`), kita melakukan *mount* folder `/uploads` di level **root aplikasi (Dasar/Root)**, bukan di dalam `/api/v1`.
```python
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
```
Karena URL-nya meleset mencari rute ke `/api/v1/uploads/`, maka peladen FastAPI menolaknya dengan error rutin 404 Not Found.

**Solusi & Perbaikan:**
Di file `frontend/src/pages/GenerateSoal.tsx`, kita harus menghapus teks `/api/v1` dari URL-nya.

Ubah deklarasi konstan kamu menjadi seperti ini:
```tsx
// Ambil URL dasar dengan menghapus /api/v1 jika ada
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '');
```

Lalu ubah pemanggilan `src` pada `<iframe />` menjadi:
```tsx
<iframe 
   src={`${BASE_URL}/uploads/${documents.find(d => d.id === modulId)?.filepath?.split('/').pop()}`} 
   className="w-full h-[600px] bg-slate-800"
/>
```

---
**Status:** **Changes Requested** 🟡  
Hanya tinggal selangkah lagi! Tolong ubah konstanta `API_URL` menjadi `BASE_URL` beserta fungsi `.replace()` tersebut, dan perbarui kode di dalam `iframe`. Silakan lakukan *push commit* jika sudah! Semangat! 🚀