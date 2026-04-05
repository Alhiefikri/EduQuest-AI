Kode ini sudah jauh lebih baik dari versi sebelumnya. Tapi ada beberapa hal yang perlu dicatat sebelum di-approve.

---

## Review Final: Apa yang Sudah Benar ✅

Semua 5 poin yang disebutkan di PR description sudah terimplementasi dengan benar. Tidak ada yang perlu diulang. Lanjut ke temuan baru.

---

## Temuan Baru yang Perlu Diaddress

### 1. `_build_cp_tp_section()` dipanggil sebelum `_smart_truncate()` didefinisikan — potential `NameError`

Ini bug urutan definisi fungsi. Di file ini, `_build_cp_tp_section()` ada di **baris ~75**, sedangkan `_smart_truncate()` baru didefinisikan di **baris ~110**. Di dalam `_build_cp_tp_section()` ada pemanggilan:

```python
konten_terpilih = _smart_truncate(...)  # dipanggil di sini
```

Di Python, fungsi didefinisikan saat file di-load secara berurutan. Ini **tidak akan error saat import** karena Python hanya mengeksekusi body fungsi saat fungsi dipanggil, bukan saat didefinisikan. Jadi runtime aman.

Tapi ini tetap **bad practice** karena membuat kode sulit dibaca dan di-maintain — siapapun yang membaca `_build_cp_tp_section()` harus scroll ke bawah untuk menemukan `_smart_truncate()`. Solusinya: pindahkan `_smart_truncate()` dan `_STOPWORDS` ke atas, sebelum `_build_cp_tp_section()`.

**Urutan definisi yang seharusnya:**
```
constants (SYSTEM_PROMPT, MAX_CONTENT_CHARS, FASE_GUIDELINES, _STOPWORDS)
    ↓
pure utility functions (_smart_truncate, _detect_tipe_konten, _get_fase_detail, _get_gaya_instruction)
    ↓
prompt builders (_build_cp_tp_section, _build_user_prompt, _build_regenerate_prompt)
    ↓
provider functions (_generate_with_*)
    ↓
orchestrators (generate_soal, regenerate_single_soal)
    ↓
utilities (test_ai_connection)
```

---

### 2. `_build_regenerate_prompt()` punya duplikasi instruksi yang konflik dengan dirinya sendiri

Di `_build_regenerate_prompt()`, ada dua blok instruksi yang tumpang tindih:

```python
# Blok 1 — dari parameter
f"Panduan Wajib untuk Fase Ini: {fase_detail}"

# Blok 2 — hardcoded di bawah, mengulang hal yang sama tapi berbeda kata
"""Instruksi Khusus (Wajib Dipatuhi):
3. Bahasa harus disesuaikan untuk anak-anak sekolah/siswa."""
```

Blok 2 ini adalah sisa dari kode lama yang belum dibersihkan. `fase_detail` dari `FASE_GUIDELINES` sudah mencakup instruksi bahasa dengan lebih lengkap dan spesifik. Hardcode "untuk anak-anak sekolah/siswa" di Blok 2 bisa bertentangan dengan `fase_detail` Fase E/F yang memang untuk remaja/dewasa muda.

Hapus poin nomor 3 dari `Instruksi Khusus` di `_build_regenerate_prompt()`:

```python
# HAPUS baris ini dari _build_regenerate_prompt
"3. Bahasa harus disesuaikan untuk anak-anak sekolah/siswa.\n"

# GANTI nomor urutannya:
# 1. DILARANG KERAS...
# 2. FOKUS HANYA...
# 3. Terapkan instruksi "Gaya Soal"... (sebelumnya nomor 4)
# 4. Output HANYA berupa JSON...  (sebelumnya nomor 5)
```

---

### 3. `_build_regenerate_prompt()` tidak punya instruksi distribusi soal — tapi ini by design, bukan bug

Ini bukan masalah. `regenerate_single_soal` hanya membuat 1 soal pengganti, jadi instruksi distribusi merata memang tidak relevan. Catat ini di komentar kode agar reviewer berikutnya tidak mempertanyakan hal yang sama:

```python
# Catatan: tidak ada instruksi distribusi soal di sini karena
# regenerate hanya menghasilkan 1 soal pengganti, bukan batch.
```

---

### 4. `FASE_GUIDELINES` Fase C masih ada celah — tidak ada larangan kata eksplisit

Fase A punya daftar kata yang dilarang. Fase C tidak punya. Ini yang membuat Qwen masih bisa pakai kata "karakteristik", "komprehensif", dll untuk Fase C meskipun contoh salah sudah ada:

```python
# SEKARANG — hanya ada contoh, tidak ada larangan eksplisit
"Fase C": (
    "Kelas 5-6 SD. Boleh 2 langkah penalaran. ..."
    "Contoh BENAR: '...' "
    "Contoh SALAH: '...'"
),

# SEHARUSNYA — tambahkan larangan kata seperti Fase A
"Fase C": (
    "Kelas 5-6 SD. Boleh 2 langkah penalaran. Boleh analogi konkret. "
    "Mulai bisa gunakan istilah mata pelajaran dasar. "
    "DILARANG menggunakan kata: karakteristik, komprehensif, hipotesis, implikasi, fundamental. "
    "Contoh BENAR: 'Sebuah kotak panjang 10 cm, lebar 5 cm, tinggi 4 cm. Berapa volumenya?' "
    "Contoh SALAH: 'Analisislah karakteristik dimensi bangun ruang secara komprehensif.'"
),
```

---

## Status Review

| Item | Status |
|------|--------|
| 5 poin dari PR description | ✅ Semua sudah benar |
| Urutan definisi fungsi | ⚠️ Perlu reorder — bukan blocker tapi wajib dirapikan |
| Duplikasi instruksi di `_build_regenerate_prompt` | 🔴 Minor bug — instruksi bahasa hardcode konflik dengan `fase_detail` |
| Catatan distribusi soal di regenerate | 📝 Tambahkan komentar saja |
| Larangan kata Fase C | ⚠️ Perlu ditambahkan agar konsisten dengan Fase A |

**Verdict: Request Changes** — dua item perlu difix sebelum bisa di-merge: duplikasi instruksi di `_build_regenerate_prompt` dan larangan kata Fase C. Reorder fungsi bisa dikerjakan bersamaan karena effort-nya kecil.

Setelah tiga item ini diperbaiki, kode ini siap untuk di-approve. Good work secara keseluruhan — arsitektur dan logika utamanya sudah solid.