# [ISSUE-27] Security: API Key Tersimpan Plain-Text di Database — Perlu Enkripsi

**Status:** Open  
**Assignee:** Junior Execution Agent  
**Prioritas:** Medium 🟡 (wajib sebelum Phase 2 / deploy ke cloud)  
**Tipe:** Security Improvement  
**Estimasi Effort:** S (setengah hari kerja)  
**File yang Terdampak:**
- `backend/app/config.py`
- `backend/app/.env.example`

---

## Deskripsi High-Level

Saat ini, seluruh API key (Gemini, Groq, OpenRouter) disimpan sebagai **plain-text string** di tabel `AppSettings` pada SQLite database. Siapapun yang memiliki akses baca ke file `data/soal.db` secara langsung dapat mengekstrak API key tersebut.

Untuk Phase 1 (aplikasi lokal), risiko ini terbatas. Namun, sebelum aplikasi dideploy ke cloud (Phase 2), ini harus sudah diselesaikan agar API key pengguna tidak terekspos melalui:
- Database yang bocor atau ter-backup ke tempat tidak aman
- Tampilan debug/log server
- File database yang tidak terproteksi di cloud storage

---

## Root Cause

Di `config.py`, `_save_db_setting()` menyimpan value langsung tanpa transformasi:

```python
await db.appsettings.upsert(
    where={"key": key},
    data={
        "update": {"value": value},   # ← plain-text
        "create": {"key": key, "value": value},  # ← plain-text
    },
)
```

Dan `_get_db_settings()` membaca kembali tanpa dekripsi:
```python
settings[row.key] = row.value  # ← plain-text
```

Sementara fungsi `_mask_key()` yang ada hanya untuk **display** di response API — bukan untuk penyimpanan.

---

## Acceptance Criteria (Syarat Selesai)

- [ ] API key dienkripsi menggunakan algoritma simetris yang aman sebelum disimpan ke database
- [ ] API key didekripsi secara transparan saat dibaca dari database (tidak ada perubahan di caller)
- [ ] Encryption key diambil dari environment variable `APP_SECRET_KEY` (bukan hardcoded)
- [ ] File `.env.example` diperbarui untuk mencantumkan `APP_SECRET_KEY` beserta instruksi cara generate-nya
- [ ] Jika `APP_SECRET_KEY` tidak diset, aplikasi memberikan warning di log dan menggunakan mode tanpa enkripsi sebagai fallback (untuk backward compatibility lokal)
- [ ] API key yang sudah tersimpan lama (plain-text) tidak menyebabkan crash — ada deteksi apakah value sudah dienkripsi atau belum

---

## Spesifikasi Teknis

### Library yang Digunakan

Gunakan `cryptography` library (sudah tersedia di ekosistem Python). Gunakan `Fernet` (symmetric encryption) dari `cryptography.fernet`:
```
pip install cryptography
```
Tambahkan ke `requirements.txt`.

### Implementasi

Di `config.py`, tambahkan dua fungsi helper:
```python
def _encrypt_value(value: str) -> str: ...
def _decrypt_value(value: str) -> str: ...
```

Keduanya menggunakan `Fernet` key yang di-derive dari `APP_SECRET_KEY` environment variable.

**Pola deteksi backward-compat:** Enkripsi Fernet menghasilkan string yang selalu dimulai dengan `gAAAAA`. Gunakan prefix ini untuk mendeteksi apakah value sudah dienkripsi atau masih plain-text lama:
```python
if value.startswith("gAAAAA"):
    return decrypt(value)
else:
    return value  # plain-text lama, return as-is
```

`_save_db_setting()` harus memanggil `_encrypt_value()` sebelum menyimpan.  
`_get_db_settings()` harus memanggil `_decrypt_value()` setelah membaca.

### Generate APP_SECRET_KEY

Dokumentasikan di `.env.example` cara generate key yang aman:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

---

## Instruksi Tambahan untuk Junior

1. **Jangan hardcode encryption key** di source code — harus selalu dari environment variable
2. **Backward compatibility wajib** — jangan crash jika ada data lama yang belum dienkripsi di database
3. Fungsi `_mask_key()` yang sudah ada untuk display **tetap dipertahankan** dan tidak diubah — itu adalah layer berbeda (presentasi)
4. Tidak ada perubahan yang diperlukan di route, model Pydantic, atau frontend — enkripsi/dekripsi transparan di layer config
5. Tambahkan unit test sederhana untuk siklus encrypt → store → retrieve → decrypt di file `tests/`

---

## Catatan untuk Product Owner

Issue ini **tidak menghambat pengembangan fitur lain** di Phase 1. Prioritaskan sebelum Phase 2 (deploy ke cloud) untuk melindungi API key guru yang menggunakan aplikasi ini.
