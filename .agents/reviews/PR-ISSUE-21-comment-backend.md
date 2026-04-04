### 📝 Senior Developer Code Review - Backend Crash Fix (StaticFiles)

Halo Junior! Terima kasih atas informasinya. Saya sudah menganalisis error yang terjadi di *backend*. 

Ternyata, aplikasi *FastAPI* (Uvicorn) gagal *start* dan mengalami **Fatal Crash** dengan pesan:
`RuntimeError: Directory 'uploads' does not exist`

**Penyebab Masalah:**
Di file `backend/app/main.py`, kamu menggunakan *middleware* `StaticFiles` untuk menyajikan file PDF dengan kode:
```python
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```
Secara bawaan (*default*), FastAPI akan memverifikasi apakah folder `uploads` benar-benar ada secara fisik di *disk* saat aplikasi pertama kali dijalankan. Jika tidak ada, aplikasi akan langsung *crash*. Selain itu, penggunaan *string* relatif `"uploads"` sangat berbahaya karena ia merujuk pada *Current Working Directory (CWD)* saat skrip dijalankan, yang bisa jadi berbeda-beda.

**Solusi & Perbaikan (Harus dilakukan di `main.py`):**
Kita sebenarnya sudah memiliki definisi `UPLOAD_DIR` (path absolut yang aman) di file `config.py` yang otomatis membuat foldernya jika belum ada. 

Ubah baris `app.mount` di file `backend/app/main.py` milikmu menjadi seperti ini:

```python
from app.config import UPLOAD_DIR
from fastapi.staticfiles import StaticFiles

# Pastikan folder benar-benar dibuat sebelum di-mount
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Gunakan absolute path dari config
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
```

*(Catatan: Jangan lupa tambahkan `import` untuk `UPLOAD_DIR` di bagian atas file `main.py` ya).*

---
**Status:** **Changes Requested** 🟡  
Dengan perbaikan ini, server Uvicorn tidak akan *crash* lagi meskipun folder `uploads` tidak ada secara fisik (karena akan otomatis dibuat). Tolong eksekusi perbaikan ini dan *push commit* tambahannya. Semangat! 🚀