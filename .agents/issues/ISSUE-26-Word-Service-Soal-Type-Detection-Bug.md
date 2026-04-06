# [ISSUE-26] Bug: Word Service Tidak Membedakan Tipe Soal Secara Akurat

**Status:** Open  
**Assignee:** Junior Execution Agent  
**Prioritas:** Medium 🟡  
**Tipe:** Bug Fix  
**Estimasi Effort:** XS (2-3 jam kerja)  
**File yang Terdampak:** `backend/app/services/word_service.py`

---

## Deskripsi High-Level

Fungsi `generate_word_document()` di `word_service.py` menentukan tipe soal (pilihan ganda vs isian/essay) secara eksklusif berdasarkan ada/tidaknya field `pilihan` dalam data soal:

```python
tipe = "pilihan_ganda" if pilihan else "isian"
```

Logika ini **berbahaya** karena:
1. Soal essay dan soal isian diperlakukan identik — padahal essay seharusnya punya ruang jawaban kosong yang lebih besar
2. Jika tipe soal adalah `campuran`, soal pilihan ganda dan soal isian/essay dicampur dalam satu batch, tapi Word tidak membedakan formatnya secara cukup jelas
3. Field `tipe_soal` yang sudah tersimpan di database (`soal.tipeSoal`) **tidak digunakan sama sekali** saat generate Word

---

## Root Cause Yang Teridentifikasi

Di `routes/word.py`, fungsi `generate_word_document()` dipanggil tanpa meneruskan metadata `tipe_soal` dari record `soal`:

```python
output_path = generate_word_document(
    soal_data=soal_data,
    template_path=template_path,
    judul_ujian=...,
    # ← tipe_soal TIDAK diteruskan!
)
```

Sementara di `word_service.py`, deteksi tipe dilakukan hanya dari kehadiran field `pilihan` per item soal. Ini fragile karena soal essay yang dibuat dari mode "campuran" mungkin punya atau tidak punya field `pilihan` tergantung model AI.

---

## Acceptance Criteria (Syarat Selesai)

- [ ] Fungsi `generate_word_document()` menerima parameter `tipe_soal: str` opsional
- [ ] Deteksi tipe soal per item menggunakan prioritas: field `tipe` di data soal (jika ada) → parameter `tipe_soal` dari parent record → fallback ke deteksi dari kehadiran `pilihan`
- [ ] Soal essay mendapat format yang berbeda dari isian — ruang jawaban essay lebih panjang (minimal 5 baris kosong) vs isian (satu garis)
- [ ] `routes/word.py` meneruskan `soal.tipeSoal` ke `generate_word_document()`
- [ ] Semua tipe soal yang ada (`pilihan_ganda`, `isian`, `essay`, `campuran`) menghasilkan format Word yang sesuai

---

## Spesifikasi Perubahan

### Di `word_service.py`

Tambahkan parameter `tipe_soal: str = ""` ke `generate_word_document()`.

Ganti logika deteksi tipe dari:
```python
tipe = "pilihan_ganda" if pilihan else "isian"
```

Menjadi deteksi berlapis yang menggunakan field `tipe` di data soal (jika model AI menyertakannya), lalu parameter `tipe_soal`, baru terakhir inferensi dari kehadiran `pilihan`.

Tambahkan fungsi `_add_essay_space()` yang menambahkan baris kosong lebih banyak untuk soal essay ketimbang isian.

### Di `routes/word.py`

Teruskan `soal.tipeSoal` sebagai parameter `tipe_soal` saat memanggil `generate_word_document()`.

---

## Instruksi Tambahan untuk Junior

- Perubahan ini murni di layer output (Word generation), **tidak mengubah kontrak API atau skema database**
- Tidak diperlukan migrasi database
- Cukup test manual dengan menghasilkan Word untuk soal tipe PG, isian, essay, dan campuran — pastikan formatnya berbeda dan sesuai
