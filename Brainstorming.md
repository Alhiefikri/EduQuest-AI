# Brainstorming: Audit & Perbaikan `ai_service.py` — EduQuest AI

> **Status**: Draft untuk review senior developer  
> **Konteks**: Soal yang di-generate sering tidak sesuai konteks materi, tidak sesuai usia/fase siswa, dan terlalu bergantung pada pengetahuan umum model (halusinasi)  
> **Provider aktif**: Groq (Llama 3.3 70B) & OpenRouter (Qwen3.6+free)  
> **Gemini**: Tidak tersedia — Google AI Studio sekarang mewajibkan billing

---

## Ringkasan Masalah

Ada **5 titik lemah** di kode saat ini, diurutkan dari yang paling berdampak ke paling kecil:

| # | Lokasi | Kategori | Dampak |
|---|--------|----------|--------|
| 1 | `SYSTEM_PROMPT` | Bug desain | Halusinasi — model berimprovisasi di luar materi |
| 2 | `_generate_with_openrouter()` | Bug kode | Output tidak konsisten, kreatif tapi tidak akurat |
| 3 | `_build_user_prompt()` — `fase_kelas` | Kelemahan desain | Soal tidak sesuai usia/kemampuan siswa |
| 4 | `_truncate_content()` | Kelemahan desain | Inti materi bisa tidak masuk ke prompt |
| 5 | `_parse_ai_response()` | Missing feature | Soal rusak lolos tanpa ada pengecekan |

---

## Masalah #1 — `SYSTEM_PROMPT` terlalu pendek dan tidak ada batasan materi

### Kondisi sekarang

```python
SYSTEM_PROMPT = "Pendidik ahli evaluasi Kurikulum Merdeka. Buat soal valid, materi inti, sesuai level kognitif, bahasa mudah dipahami, nada edukatif."
```

### Mengapa ini masalah besar

Ini adalah akar dari **masalah halusinasi**. System prompt hanya mendefinisikan *persona* model, tapi tidak memberikan **batasan operasional** yang tegas. Ketika model merasa materi di prompt "kurang cukup" untuk membuat soal, model akan secara otomatis mengisi kekurangan itu dengan pengetahuan umumnya sendiri — perilaku default yang memang dirancang begitu oleh LLM.

Tidak ada instruksi yang melarang model untuk:
- Menambah fakta dari luar teks materi
- Membuat soal tentang konsep yang tidak disebutkan di modul
- Berimprovisasi jika materi terasa terlalu singkat

### Usulan perbaikan

```python
SYSTEM_PROMPT = """Kamu adalah sistem pembuat soal ujian untuk Kurikulum Merdeka Indonesia.

ATURAN MUTLAK — TIDAK BOLEH DILANGGAR:
1. Soal HANYA boleh dibuat berdasarkan teks materi yang diberikan di bagian "Materi:" dalam prompt.
2. DILARANG KERAS menambahkan fakta, konsep, contoh, atau informasi dari luar teks materi tersebut.
3. DILARANG membuat soal tentang cara mengajar, metode pembelajaran, atau alat peraga guru.
4. Jika teks materi tidak cukup untuk membuat jumlah soal yang diminta, kurangi jumlah soal — jangan mengarang.
5. Output HANYA berupa JSON valid. Tidak ada kalimat pembuka, penutup, atau penjelasan."""
```

**Poin kritis untuk didiskusikan dengan senior:**
- Apakah instruksi "kurangi jumlah soal" ini perlu dikomunikasikan ke UI juga? Artinya response perlu ada field `actual_count` selain `soal`.
- Apakah perlu instruksi fallback: jika materi benar-benar tidak cukup, return `{"error": "materi_tidak_cukup", "soal": []}` agar controller bisa handle dengan pesan yang jelas ke user?

---

## Masalah #2 — `_generate_with_openrouter()` tidak ada parameter sampling

### Kondisi sekarang

```python
async with OpenRouter(...) as client:
    response = await client.chat.send_async(
        model=model,
        messages=messages,
        # ← tidak ada temperature, top_p, max_tokens
    )
```

### Mengapa ini masalah

Tanpa `temperature` dan `top_p`, model berjalan dengan nilai default bawaan. Untuk Qwen3.6+free di OpenRouter, default `temperature` bisa sangat tinggi (mendekati 1.0 atau lebih), yang artinya model mengambil token secara lebih acak dan "kreatif" — hasilnya output yang tidak konsisten dan sering menyimpang dari instruksi.

Bandingkan dengan Gemini dan Groq yang sudah diset di kode:

```python
# Gemini — sudah ada
config = types.GenerateContentConfig(
    temperature=0.7,
    max_output_tokens=8192,
    ...
)

# Groq — sudah ada
response = await client.chat.completions.create(
    temperature=0.7,
    max_tokens=4096,
    ...
)

# OpenRouter — TIDAK ADA sama sekali ← bug
response = await client.chat.send_async(
    model=model,
    messages=messages,
)
```

### Usulan perbaikan

```python
response = await client.chat.send_async(
    model=model,
    messages=messages,
    temperature=0.2,    # rendah = deterministik, fokus pada instruksi
    top_p=0.85,         # batasi sampling hanya dari token probabilitas tinggi
    max_tokens=4096,    # cegah response terpotong
)
```

**Catatan untuk senior:** Nilai `temperature=0.2` sengaja lebih rendah dari Gemini/Groq (`0.7`) karena Qwen+free memiliki kecenderungan "kreatif" yang lebih tinggi. Perlu A/B test untuk menemukan nilai optimal. Groq juga sebaiknya diturunkan dari 0.7 ke 0.3 untuk use case generasi soal yang membutuhkan konsistensi tinggi.

---

## Masalah #3 — `fase_kelas` hanya string label, tanpa makna pedagogis

### Kondisi sekarang

```python
prompt = f"""Buat {jumlah_soal} soal {tipe_label.get(tipe_soal, tipe_soal)}:
Fase/Kelas: {fase_kelas} | Mapel: {mata_pelajaran} | Topik: {topik or 'Materi inti'}
..."""
```

Ketika `fase_kelas = "Fase A"`, model hanya menerima teks "Fase A" — tanpa tahu apa artinya secara konkret. Model tidak tahu bahwa Fase A berarti kalimat pendek, kosakata dasar, dan konsep konkret. Model akan menginterpretasikan sendiri berdasarkan training data-nya, yang tidak konsisten.

### Usulan perbaikan

Tambahkan konstanta mapping di level modul:

```python
FASE_GUIDELINES: dict[str, str] = {
    "Fase A": (
        "Kelas 1-2 SD. "
        "WAJIB: kalimat maksimal 8 kata per soal, "
        "gunakan hanya kosakata yang biasa didengar anak usia 6-8 tahun, "
        "konsep harus konkret dan bisa dilihat/diraba (JANGAN abstrak), "
        "JANGAN gunakan kata: 'analisis', 'evaluasi', 'konsep', 'prinsip'."
    ),
    "Fase B": (
        "Kelas 3-4 SD. "
        "Kalimat maksimal 12 kata, boleh 1 langkah penalaran sederhana, "
        "konteks harus dekat kehidupan sehari-hari siswa."
    ),
    "Fase C": (
        "Kelas 5-6 SD. "
        "Boleh 2 langkah penalaran, boleh analogi konkret, "
        "mulai bisa gunakan istilah mapel dasar."
    ),
    "Fase D": (
        "Kelas 7-9 SMP. "
        "Boleh penalaran multi-langkah, konteks sosial dan sains dasar, "
        "istilah akademik boleh dengan konteks yang jelas."
    ),
    "Fase E": (
        "Kelas 10-11 SMA. "
        "Analisis dan evaluasi argumen, konteks kompleks, "
        "istilah akademik penuh diperbolehkan."
    ),
    "Fase F": (
        "Kelas 12 SMA / setara. "
        "Sintesis, kreasi, dan evaluasi kritis. "
        "Soal boleh multi-perspektif dan open-ended."
    ),
    "umum": (
        "Sesuaikan kompleksitas bahasa dengan konteks materi yang diberikan."
    ),
}
```

Lalu di `_build_user_prompt()`:

```python
fase_detail = FASE_GUIDELINES.get(fase_kelas, FASE_GUIDELINES["umum"])

prompt = f"""...
Panduan Wajib untuk Fase Ini:
{fase_detail}
..."""
```

**Poin untuk senior:** Mapping ini perlu disinkronkan dengan frontend — apakah nilai `fase_kelas` yang dikirim dari UI sudah pasti salah satu dari key di atas? Perlu validasi di layer controller/router juga.

---

## Masalah #4 — `_truncate_content()` memotong dari awal tanpa prioritas

### Kondisi sekarang

```python
def _truncate_content(content: str, max_chars: int = MAX_CONTENT_CHARS) -> str:
    if len(content) <= max_chars:
        return content
    truncated = str(content)[:max_chars]  # ← selalu ambil dari awal
    last_period = truncated.rfind(".")
    if last_period > max_chars * 0.8:
        truncated = str(truncated)[:last_period + 1]
    return str(truncated) + "\n\n[Konten diringkas agar fokus pada materi inti]"
```

### Mengapa ini masalah

Dokumen modul ajar biasanya memiliki struktur:

```
[Halaman 1-2]  → Identitas modul, kata pengantar, capaian pembelajaran (METADATA)
[Halaman 3-N]  → Isi materi, konsep, contoh soal (KONTEN INTI)
[Halaman akhir] → Rangkuman, daftar pustaka
```

Jika dokumen 30.000 karakter dan di-truncate ke 8.000 char pertama, ada kemungkinan tinggi yang masuk ke prompt hanya **metadata dan pendahuluan**, bukan materi inti. Model lalu membuat soal berdasarkan capaian pembelajaran yang tertulis di pendahuluan (bukan isi materi), atau lebih buruk — berhalusinasi karena tidak punya cukup konten substantif.

### Usulan perbaikan

Strategi "head + tail" — ambil sebagian awal dan sebagian akhir, lompati bagian tengah yang cenderung adalah isi terpanjang tapi paling padat:

```python
def _truncate_content(content: str, max_chars: int = MAX_CONTENT_CHARS) -> str:
    if len(content) <= max_chars:
        return content

    # Ambil 65% dari awal (dapat intro + awal materi)
    # dan 35% dari akhir (dapat rangkuman + akhir materi)
    head_limit = int(max_chars * 0.65)
    tail_limit = int(max_chars * 0.35)

    head = content[:head_limit]
    tail = content[-tail_limit:]

    # Potong di batas kalimat agar tidak terpotong di tengah kata
    last_period_head = head.rfind(".")
    if last_period_head > head_limit * 0.85:
        head = head[:last_period_head + 1]

    first_period_tail = tail.find(".")
    if first_period_tail != -1 and first_period_tail < tail_limit * 0.15:
        tail = tail[first_period_tail + 1:].lstrip()

    return (
        head
        + "\n\n[... bagian tengah diringkas untuk efisiensi prompt ...]\n\n"
        + tail
    )
```

**Catatan untuk senior:** Solusi jangka panjang yang lebih baik adalah implementasi ekstraksi berbasis struktur dokumen (heading, sub-bab) di layer controller sebelum konten dikirim ke `generate_soal()`. TODO ini sudah ada di komentar kode (`# TODO: Implementasi ekstraksi PDF berdasarkan rentang halaman`). Ini prioritas tinggi jika ingin hasil soal yang benar-benar kontekstual.

---

## Masalah #5 — `_parse_ai_response()` tidak validasi konten soal

### Kondisi sekarang

```python
def _parse_ai_response(response_text: str) -> List[dict]:
    # ... strip markdown, json.loads, fallback find("{")...
    if isinstance(data, dict) and "soal" in data:
        return data["soal"]
    # ← langsung return, tanpa cek apapun soalnya valid atau tidak
```

### Mengapa ini masalah

Parser hanya memvalidasi **struktur JSON** (apakah bisa di-parse), tapi tidak memvalidasi **konten soal**. Soal dengan kondisi berikut akan lolos tanpa peringatan apapun:

- Jawaban `"D"` tapi pilihan hanya ada `A`, `B`, `C`
- Field `pertanyaan` kosong atau hanya whitespace
- Pilihan `A`, `B`, `C`, `D` semuanya identik (model stuck)
- `pembahasan` berisi teks template `"..."` yang tidak diganti model

### Usulan perbaikan

Tambahkan fungsi validasi ringan yang dijalankan setelah parsing:

```python
def _validate_soal_item(soal: dict, tipe_soal: str) -> tuple[bool, str]:
    """
    Return (is_valid, reason).
    Validasi minimal — cukup untuk filter soal paling rusak.
    """
    # Cek pertanyaan tidak kosong
    pertanyaan = soal.get("pertanyaan", "").strip()
    if not pertanyaan or pertanyaan == "...":
        return False, "pertanyaan kosong atau placeholder"

    # Cek jawaban tidak kosong
    jawaban = soal.get("jawaban", "").strip()
    if not jawaban or jawaban == "...":
        return False, "jawaban kosong atau placeholder"

    # Khusus pilihan ganda: jawaban harus ada di pilihan
    if tipe_soal in ["pilihan_ganda", "campuran"]:
        pilihan = soal.get("pilihan", [])
        if len(pilihan) < 4:
            return False, f"pilihan kurang dari 4, hanya ada {len(pilihan)}"
        # Jawaban biasanya "A", "B", "C", "D" atau "A. ..."
        jawaban_huruf = jawaban[0].upper() if jawaban else ""
        valid_huruf = {"A", "B", "C", "D"}
        if jawaban_huruf not in valid_huruf:
            return False, f"format jawaban tidak dikenali: '{jawaban}'"
        # Cek pilihan tidak semua sama
        if len(set(p.strip() for p in pilihan)) == 1:
            return False, "semua pilihan identik"

    return True, "ok"


def _parse_ai_response(response_text: str, tipe_soal: str = "pilihan_ganda") -> List[dict]:
    # ... (kode parsing yang sudah ada) ...

    soal_list = data["soal"] if isinstance(data, dict) and "soal" in data else data

    # Validasi setiap item
    valid_soal = []
    invalid_count = 0
    for item in soal_list:
        is_valid, reason = _validate_soal_item(item, tipe_soal)
        if is_valid:
            valid_soal.append(item)
        else:
            invalid_count += 1
            # Log untuk debugging — jangan raise, biarkan soal valid tetap lolos
            print(f"[WARN] Soal nomor {item.get('nomor', '?')} dibuang: {reason}")

    if not valid_soal:
        raise ValueError(
            f"Semua soal gagal validasi ({invalid_count} item). "
            "Coba regenerate atau periksa konten modul."
        )

    return valid_soal
```

**Catatan:** Perlu update signature `_parse_ai_response()` dan semua pemanggilan-nya di `generate_soal()` dan `regenerate_single_soal()` untuk pass `tipe_soal`.

---

## Diskusi: Pilihan Model Gratis (Groq vs OpenRouter)

### Opsi 1 — Groq: Llama 3.3 70B (Rekomendasi Utama)

**Kelebihan:**
- Sudah terintegrasi di kode, tidak perlu SDK baru
- Groq inference sangat cepat (LPU hardware)
- Llama 3.3 70B bagus untuk instruction-following dan Bahasa Indonesia
- Native `response_format: {"type": "json_object"}` — lebih reliable dari parsing manual
- `temperature` sudah di-set (meski nilai 0.7 terlalu tinggi, perlu diturunkan ke 0.3)

**Kekurangan:**
- Rate limit free tier: ~30 req/menit, 14.400 req/hari
- Context window 128K token tapi `max_tokens` di kode hanya 4096 — mungkin kurang untuk generate banyak soal sekaligus

**Rekomendasi perubahan kode Groq:**
```python
response = await client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=messages,
    temperature=0.3,    # turunkan dari 0.7
    max_tokens=6000,    # naikkan dari 4096 untuk batch soal banyak
    response_format={"type": "json_object"},
)
```

### Opsi 2 — OpenRouter: Qwen3.6+free (Kondisi Sekarang, Perlu Fix)

**Masalah utama:**
- Free tier di OpenRouter sering throttled dan rate limit tidak transparan
- Qwen dioptimasi untuk coding dan reasoning, bukan generasi konten edukatif bahasa Indonesia
- Tidak ada `temperature` di kode sekarang (Bug #2)

**Jika tetap pakai Qwen**, minimal tambahkan:
```python
response = await client.chat.send_async(
    model="qwen/qwen3-235b-a22b:free",  # pertimbangkan versi lebih besar
    messages=messages,
    temperature=0.2,
    top_p=0.85,
    max_tokens=4096,
)
```

### Opsi 3 — OpenRouter: Model Gratis Lain yang Lebih Cocok

Beberapa model gratis di OpenRouter yang mungkin lebih baik untuk use case ini:

| Model | Konteks | Keunggulan |
|-------|---------|------------|
| `meta-llama/llama-3.3-70b-instruct:free` | 128K | Sama dengan Groq, lebih stabil |
| `mistralai/mistral-7b-instruct:free` | 32K | Ringan, cepat, cukup baik untuk soal sederhana |
| `microsoft/phi-3-medium-128k-instruct:free` | 128K | Konteks panjang, bagus untuk dokumen panjang |

**Rekomendasi akhir:** Prioritaskan **Groq (Llama 3.3 70B)** sebagai provider utama, dengan Qwen/OpenRouter sebagai fallback ketika Groq rate limit tercapai. Pola ini sudah ada di kode (`if provider == "groq": ... elif provider == "openrouter": ...`) dan bisa dikembangkan menjadi auto-fallback.

---

## Prioritas Implementasi yang Disarankan

Diurutkan berdasarkan **dampak** vs **effort**:

| Prioritas | Item | Effort | Dampak |
|-----------|------|--------|--------|
| 🔴 P1 | Fix `SYSTEM_PROMPT` — tambah aturan batasan materi | Rendah (1 file, ~10 baris) | Sangat Tinggi |
| 🔴 P1 | Fix `_generate_with_openrouter()` — tambah `temperature=0.2` | Rendah (3 baris) | Tinggi |
| 🟡 P2 | Tambah `FASE_GUIDELINES` mapping dan inject ke prompt | Sedang (~30 baris) | Tinggi |
| 🟡 P2 | Turunkan `temperature` Groq dari 0.7 ke 0.3 | Rendah (1 baris) | Sedang |
| 🟢 P3 | Perbaiki `_truncate_content()` — strategi head+tail | Sedang (~20 baris) | Sedang |
| 🟢 P3 | Tambah `_validate_soal_item()` post-parsing | Sedang (~30 baris) | Sedang |
| ⚪ P4 | Ekstraksi konten berbasis struktur PDF (TODO di controller) | Tinggi | Sangat Tinggi (jangka panjang) |

---

## Pertanyaan Terbuka untuk Diskusi Senior

1. **Auto-fallback provider**: Apakah kita implementasi logika otomatis "jika Groq rate limit → fallback ke OpenRouter"? Ini butuh perubahan di `generate_soal()` tapi sangat berguna untuk production reliability.

2. **Partial success handling**: Jika dari 10 soal yang diminta, 7 valid dan 3 gagal validasi — apakah kita return 7 saja dan beri tahu user, atau retry untuk yang 3? Retry akan menambah latency dan cost API.

3. **Logging soal yang dibuang**: Apakah soal yang gagal validasi perlu di-log ke database untuk analisis kualitas prompt di masa depan?

4. **Context window vs jumlah soal**: Dengan `max_tokens=4096` di Groq, generate 20 soal dengan pembahasan bisa mendekati batas. Apakah perlu batasan `jumlah_soal` maksimal per request berdasarkan provider?

5. **Sinkronisasi `FASE_GUIDELINES` dengan frontend**: Nilai string `fase_kelas` yang dikirim UI harus match persis dengan key di mapping. Perlu validasi di router atau schema Pydantic.

---

*Dokumen ini adalah bahan diskusi awal. Semua usulan kode di atas adalah draft dan perlu review lebih lanjut sebelum implementasi.*