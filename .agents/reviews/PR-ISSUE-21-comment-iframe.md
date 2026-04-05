### 📝 Senior Developer Code Review - PDF Preview Fix (CORS & Routing)

Halo Junior! Laporan masalah (*bug report*) kembali masuk. Saat pengguna mencoba mengakses opsi **Modul Ajar** di *Step 2* dan ingin melihat *preview* PDF, layar justru menampilkan halaman error putih bertuliskan:
`Unexpected Application Error! 404 Not Found - You can provide a way better UX...`

**Kenapa ini terjadi?**
Ini adalah masalah fundamental arsitektur *Single Page Application* (SPA) dengan *React Router*.
Di file `frontend/src/pages/GenerateSoal.tsx`, kamu menulis *source iframe* seperti ini:
```tsx
<iframe 
   src={`/uploads/${documents.find(d => d.id === modulId)?.filepath?.split('/').pop()}`} 
   className="w-full h-[600px] bg-slate-800"
/>
```
Karena kamu menggunakan *relative path* (`/uploads/...`), *browser* menganggap kamu sedang mencoba pindah ke halaman/rute React baru di alamat Frontend (misal `localhost:5173/uploads/file.pdf`). React Router tentu saja kebingungan dan merespons dengan **404 Not Found** karena kamu tidak pernah mendaftarkan halaman untuk URL `/uploads`.

**Solusi & Perbaikan:**
File PDF itu dilayani oleh peladen (server) **Backend FastAPI**, bukan Frontend React. Kamu harus memberikan *Absolute URL* yang merujuk pada `API_URL` Backend kita.

1. Di file `GenerateSoal.tsx`, tambahkan variabel konstanta untuk alamat backend (sama seperti yang kamu pakai di fungsi `services/soal.ts`):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

2. Ubah properti `src` pada elemen `<iframe />` menjadi:
```tsx
<iframe 
   src={`${API_URL}/uploads/${documents.find(d => d.id === modulId)?.filepath?.split('/').pop()}`} 
   className="w-full h-[600px] bg-slate-800"
/>
```

---
**Status:** **Changes Requested** 🟡  
Secara logika ini *bug* kecil tapi berdampak fatal pada pengalaman pengguna (UX). Tolong segera tambahkan variabel `API_URL` tersebut ke dalam komponen `GenerateSoal.tsx` dan ubah `src` *iframe*-nya. Jika sudah, *push commit* perbaikannya! 🚀