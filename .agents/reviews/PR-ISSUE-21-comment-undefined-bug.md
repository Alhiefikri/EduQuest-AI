### 📝 Senior Developer Code Review - Bug Fix (`/uploads/undefined`)

Halo Junior! Laporan *testing* terbaru menunjukkan bahwa meskipun *iframe* sudah terhubung ke backend, file PDF-nya masih gagal dimuat dan terminal menampilkan peringatan:
`INFO: 127.0.0.1:36114 - "GET /uploads/undefined HTTP/1.1" 404 Not Found`

*(Abaikan juga peringatan `/sw.js`, itu hanya peringatan Service Worker lokal yang tidak berdampak pada sistem).*

**Akar Masalah (Root Cause):**
Mengapa *browser* mencari file `undefined`?
Ini terjadi karena di `GenerateSoal.tsx`, kamu mencoba memanggil variabel `filepath` dari *state* documents:
```typescript
documents.find(d => d.id === modulId)?.filepath
```
Di TypeScript (*Frontend*), kamu memang sudah menambahkan tipe `filepath` ke antarmuka `DocumentItem` di PR ini. **TETAPI**, kamu lupa mengubah model Pydantic-nya di **Backend** (`backend/app/models/document.py`)! 

Karena model `DocumentListResponse` di backend tidak mempublikasikan `filepath`, API tidak pernah mengirimkan nilai `filepath` tersebut ke *frontend*. Sehingga, saat *frontend* mencoba mengaksesnya, nilainya adalah `undefined`.

**Solusi & Perbaikan (Backend):**
Buka file `backend/app/models/document.py` dan ubah model `DocumentResponse` dan `DocumentListResponse` untuk menyertakan `filepath`:

1. Pada kelas `DocumentResponse` (di dalam `from_prisma` dan definisinya):
```python
class DocumentResponse(BaseModel):
    id: str
    filename: str
    filepath: str # Tambahkan ini
    # ... dst

    @classmethod
    def from_prisma(cls, doc) -> "DocumentResponse":
        return cls(
            id=doc.id,
            filename=doc.filename,
            filepath=doc.filepath, # Tambahkan ini
            # ... dst
```

2. Pada kelas `DocumentListResponse` (di dalam `from_prisma` dan definisinya):
```python
class DocumentListResponse(BaseModel):
    id: str
    filename: str
    filepath: str # Tambahkan ini
    # ... dst

    @classmethod
    def from_prisma(cls, doc) -> "DocumentListResponse":
        return cls(
            id=doc.id,
            filename=doc.filename,
            filepath=doc.filepath, # Tambahkan ini
            # ... dst
```

---
**Status:** **Changes Requested** 🟡  
Ini adalah masalah sinkronisasi *Schema* klasik antara *Backend* dan *Frontend*. Tolong eksekusi perbaikan di file `backend/app/models/document.py` tersebut. Jika sudah, API `/api/v1/documents` akan mengirimkan nilai `filepath` yang sebenarnya dan *iframe* akan langsung berfungsi. Semangat! 🚀