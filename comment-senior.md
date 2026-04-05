Saya baca kodenya secara menyeluruh. Ada beberapa temuan — sebagian kecil bug, sebagian besar adalah kelemahan yang bisa menyebabkan masalah di production.

---

## Temuan 1 — `_detect_tipe_konten()` terlalu lemah (risiko tinggi)

```python
# KONDISI SEKARANG — hanya cek 2 keyword
def _detect_tipe_konten(konten: str) -> str:
    konten_lower = konten.lower()
    if "tujuan pembelajaran" in konten_lower or "capaian pembelajaran" in konten_lower:
        return "cp_tp"
    return "modul_ajar"
```

Masalahnya: modul ajar yang bagus hampir selalu **menyertakan** frasa "tujuan pembelajaran" di bagian pembukaan sebelum isi materinya. Artinya modul ajar dengan pendahuluan standar akan salah dideteksi sebagai `cp_tp`, lalu diperlakukan dengan strategi prompt yang salah.

Selain itu, `input_manual` tidak pernah bisa terdeteksi dari fungsi ini — padahal itu salah satu dari tiga tipe yang ada.

```python
# PERBAIKAN — scoring berbasis bobot, bukan binary check
def _detect_tipe_konten(konten: str) -> str:
    konten_lower = konten.lower()

    # Penanda kuat CP/TP — frasa yang hanya muncul di dokumen kurikulum
    cp_tp_markers = [
        "pada akhir fase",
        "peserta didik dapat",
        "peserta didik mampu",
        "alur tujuan pembelajaran",
        "capaian pembelajaran fase",
        "atp matematika",
        "atp bahasa",
        "elemen capaian",
    ]

    # Penanda kuat modul ajar — ada konten substantif, bukan hanya tujuan
    modul_markers = [
        "contoh soal",
        "perhatikan contoh",
        "diketahui",
        "penyelesaian",
        "latihan",
        "rumus",
        "teorema",
        "definisi",
        "misalnya",
        "perhatikan gambar",
    ]

    cp_tp_score  = sum(1 for m in cp_tp_markers if m in konten_lower)
    modul_score  = sum(1 for m in modul_markers  if m in konten_lower)

    # Butuh minimal 2 penanda kuat CP/TP untuk diklasifikasi cp_tp
    # (mencegah modul ajar dengan pendahuluan standar salah klasifikasi)
    if cp_tp_score >= 2 and cp_tp_score > modul_score:
        return TipeKonten.cp_tp.value

    return TipeKonten.modul_ajar.value
```

---

## Temuan 2 — `_build_cp_tp_section()` tidak memanggil `_smart_truncate()` (bug)

```python
# KONDISI SEKARANG — konten CP/TP dikirim mentah tanpa truncate
def _build_cp_tp_section(konten_cp_tp: str, mata_pelajaran: str, topik: str) -> str:
    return (
        f"Capaian/Tujuan Pembelajaran untuk {mata_pelajaran}:\n"
        f"{konten_cp_tp}\n\n"   # ← tidak ada truncate di sini
        ...
    )
```

Jika user paste CP/TP yang panjang (misalnya seluruh ATP satu semester), konten akan dikirim penuh ke model tanpa batasan. Ini bisa menyebabkan token limit terlampaui di Groq free tier.

```python
# PERBAIKAN
def _build_cp_tp_section(konten_cp_tp: str, mata_pelajaran: str, topik: str) -> str:
    konten_terpilih = _smart_truncate(
        konten_cp_tp,
        topik=topik,
        mata_pelajaran=mata_pelajaran,
    )
    return (
        f"Capaian/Tujuan Pembelajaran untuk {mata_pelajaran}:\n"
        f"{konten_terpilih}\n\n"
        f"INSTRUKSI KHUSUS UNTUK CP/TP:\n"
        ...
    )
```

---

## Temuan 3 — `SYSTEM_PROMPT` konflik dengan `_build_cp_tp_section()` (bug logika)

Ini yang paling subtle tapi paling berdampak. `SYSTEM_PROMPT` menyatakan:

```
Aturan 1: Soal HANYA boleh dibuat berdasarkan teks materi yang diberikan.
Aturan 2: DILARANG KERAS menambahkan fakta dari luar teks materi.
```

Tapi `_build_cp_tp_section()` justru meminta model melakukan sebaliknya:

```python
# Instruksi ini secara eksplisit meminta model pakai pengetahuan umumnya
"Gunakan level kognitif yang sesuai (aplikasi, analisis, evaluasi)"
```

Ketika input adalah CP/TP, model menerima dua instruksi yang bertentangan:
- System prompt: "jangan pakai pengetahuan luar"
- User prompt: "buat soal aplikasi" (tapi tidak ada materi aplikasinya)

Model akan bingung dan hasilnya tidak konsisten antar provider. Groq mematuhi system prompt → soal terlalu basic. Qwen mengikuti user prompt → halusinasi.

Solusinya adalah **memodifikasi SYSTEM_PROMPT secara kondisional** berdasarkan tipe konten, atau menambahkan instruksi pengecualian yang eksplisit di CP/TP section:

```python
def _build_cp_tp_section(konten_cp_tp: str, mata_pelajaran: str, topik: str) -> str:
    konten_terpilih = _smart_truncate(konten_cp_tp, topik=topik, mata_pelajaran=mata_pelajaran)
    return (
        f"Capaian/Tujuan Pembelajaran untuk {mata_pelajaran}:\n"
        f"{konten_terpilih}\n\n"
        f"INSTRUKSI KHUSUS UNTUK MODE CP/TP:\n"
        f"Pengecualian Aturan 1 & 2 dari system prompt: Untuk mode CP/TP, kamu DIIZINKAN "
        f"menggunakan pengetahuanmu tentang {mata_pelajaran} untuk membuat soal — "
        f"TAPI hanya dalam cakupan topik yang disebutkan di CP/TP di atas.\n"
        f"Buat soal yang menguji ketercapaian tujuan tersebut, bukan soal tentang tujuannya.\n"
        f"Jika tujuan menyebut 'menghitung volume', buat soal hitung — BUKAN 'apa itu volume'.\n"
        f"Jika tujuan menyebut 'menyajikan data', buat soal interpretasi — BUKAN 'apa itu diagram'."
    )
```

---

## Temuan 4 — `_build_user_prompt()`: instruksi distribusi soal hilang

Di diskusi sebelumnya sudah disepakati perlu instruksi distribusi soal merata antar unit/topik. Tapi di kode terbaru ini tidak ada. Ini yang menyebabkan Groq menumpuk semua soal di Unit 1 (Bangun Ruang) saja.

```python
# Di _build_user_prompt(), tambahkan di bagian Aturan Wajib:
prompt = f"""...
Aturan Wajib:
1. FOKUS materi inti. JANGAN buat soal tentang metode/alat peraga guru.
2. Bahasa sesuai tingkat siswa.
3. Output HANYA JSON valid sesuai skema: {schema_str}
4. Distribusikan soal secara merata ke semua topik/unit yang ada di materi. \
Jangan buat semua soal dari satu topik saja meskipun topik itu paling panjang.
5. Jawaban akurat & pembahasan jelas. No intro/outro."""
```

---

## Temuan 5 — `FASE_GUIDELINES` Fase C: contoh soal tidak relevan dengan konteks matematika

```python
# KONDISI SEKARANG — contoh soal tentang IPA, bukan matematika
"Fase C": (
    ...
    "Contoh BENAR: 'Mengapa es batu mencair jika diletakkan di luar?' "
    "Contoh SALAH: 'Analisislah perubahan entalpi pada reaksi eksoterm!'"
),
```

CP/TP yang diuji adalah matematika (bangun ruang, statistika), tapi contoh soalnya tentang IPA. Ini tidak konsisten dan bisa membingungkan model. Contoh harus domain-agnostic atau lebih umum:

```python
"Fase C": (
    "Kelas 5-6 SD. Boleh 2 langkah penalaran. Boleh analogi konkret. "
    "Mulai bisa gunakan istilah mata pelajaran dasar. "
    "DILARANG menggunakan kata: karakteristik, hipotesis, fundamental, implikasi. "
    "Contoh BENAR: 'Sebuah kotak panjang 10 cm, lebar 5 cm, tinggi 4 cm. Berapa volumenya?' "
    "Contoh SALAH: 'Analisislah karakteristik dimensi bangun ruang berikut secara komprehensif.'"
),
```

---

## Ringkasan Status Kode

| # | Fungsi | Status | Severity |
|---|--------|--------|----------|
| 1 | `_detect_tipe_konten()` | Bug — false positive tinggi | Tinggi |
| 2 | `_build_cp_tp_section()` — truncate | Bug — konten tidak di-truncate | Sedang |
| 3 | Konflik `SYSTEM_PROMPT` vs CP/TP section | Bug logika — instruksi bertentangan | Tinggi |
| 4 | Distribusi soal hilang dari prompt | Regression — fitur yang disepakati tidak ada | Sedang |
| 5 | Contoh soal Fase C tidak relevan | Kelemahan — bisa membingungkan model | Rendah |
| ✅ | `TipeKonten` enum + routing | Sudah benar | — |
| ✅ | Retry + Partial Success di `generate_soal()` | Sudah benar | — |
| ✅ | `_validate_soal_item()` | Sudah benar | — |
| ✅ | Parameter sampling semua provider | Sudah benar | — |
| ✅ | `FASE_GUIDELINES` struktur | Sudah benar | — |

Temuan 1 dan 3 harus diperbaiki sebelum testing — keduanya akan menyebabkan behavior tidak terduga di production. Temuan 2 dan 4 perlu diperbaiki sebelum merge. Temuan 5 bisa masuk backlog atau diperbaiki bersamaan.