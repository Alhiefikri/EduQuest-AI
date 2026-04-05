# [ISSUE-22] Perbaikan Kualitas Generasi Soal — `ai_service.py`

**Status:** Done  
**Assignee:** Junior Execution Agent  
**Prioritas:** High  
**File utama:** `backend/app/services/ai_service.py`  

**Latar belakang:** Soal yang di-generate AI sering kali mengalami halusinasi (berada di luar konteks materi), tidak sesuai dengan usia/fase kognitif siswa, dan memiliki format JSON yang sering tidak konsisten. Setelah direview, dokumen rencana awal membutuhkan beberapa penyesuaian khusus (terutama terkait format `fase_kelas` dari frontend dan `temperature` dari Gemini).

---

## Deskripsi High-Level
Perbaiki logika prompting, chunking materi, serta validasi respons AI pada file `backend/app/services/ai_service.py`. Ini dibagi menjadi 6 sub-task kecil (ISS-01 s.d. ISS-06). 

---

## Daftar Sub-Task (Issue)

| ID | Judul | File |
|----|-------|------|
| ISS-01 | Perkuat `SYSTEM_PROMPT` dengan aturan anti-halusinasi | `ai_service.py` |
| ISS-02 | Tambah parameter sampling di `_generate_with_openrouter()` | `ai_service.py` |
| ISS-03 | Turunkan `temperature` Groq dan Gemini menjadi 0.3 | `ai_service.py` |
| ISS-04 | Tambah `FASE_GUIDELINES` mapping dan inject ke prompt | `ai_service.py` |
| ISS-05 | Ganti `_truncate_content()` dengan `_smart_truncate()` berbasis keyword | `ai_service.py` |
| ISS-06 | Tambah validasi konten soal + logika Partial Success di `generate_soal()` | `ai_service.py` |

---

## Detail Instruksi Eksekusi

### ISS-01 — Perkuat `SYSTEM_PROMPT` dengan aturan anti-halusinasi
Ganti variabel `SYSTEM_PROMPT` (di baris awal `ai_service.py`) seluruhnya dengan versi berikut:
```python
SYSTEM_PROMPT = """Kamu adalah sistem pembuat soal ujian untuk Kurikulum Merdeka Indonesia.

ATURAN MUTLAK — TIDAK BOLEH DILANGGAR:
1. Soal HANYA boleh dibuat berdasarkan teks materi yang diberikan di bagian "Materi:" dalam prompt.
2. DILARANG KERAS menambahkan fakta, konsep, contoh, atau informasi dari luar teks materi tersebut.
3. DILARANG membuat soal tentang cara mengajar, metode pembelajaran, atau alat peraga guru.
4. Jika teks materi tidak cukup untuk membuat jumlah soal yang diminta, hasilkan soal sebanyak yang bisa dibuat dari materi — jangan mengarang untuk memenuhi kuota.
5. Output HANYA berupa JSON valid. Tidak ada kalimat pembuka, penutup, atau penjelasan apapun."""
```
*(Catatan: Aturan no. 4 akan ditangani oleh UI dengan mengecek length soal).*

---

### ISS-02 — Tambah parameter sampling di `_generate_with_openrouter()`
Pada fungsi `_generate_with_openrouter()`, tambahkan parameter `temperature`, `top_p`, dan `max_tokens` pada `client.chat.send_async()`.

```python
response = await client.chat.send_async(
    model=model,
    messages=messages,
    temperature=0.2,   # Qwen cenderung sangat kreatif, batasi ini.
    top_p=0.85,
    max_tokens=4096,
)
```

---

### ISS-03 — Turunkan `temperature` Groq dan Gemini menjadi 0.3
Pada generasi JSON terstruktur, nilai temperatur yang tinggi sangat mengacaukan hasil.
- Pada `_generate_with_groq()`: ubah `temperature=0.7` menjadi `temperature=0.3`.
- Pada `_generate_with_gemini()`: pada `types.GenerateContentConfig()`, ubah `temperature=0.7` menjadi `temperature=0.3`.

---

### ISS-04 — Tambah `FASE_GUIDELINES` mapping dan inject ke prompt
**(Revisi Senior Agent: Nilai `fase_kelas` dari frontend sering berisi string seperti `"Fase A / Kelas 1"` atau `"umum"`. Oleh karena itu pencocokan harus memakai metode substring, BUKAN exact matching `.get()`!)**

1. Tambahkan konstanta ini setelah `MAX_CONTENT_CHARS`:
```python
FASE_GUIDELINES: dict[str, str] = {
    "Fase A": (
        "Kelas 1-2 SD. WAJIB: kalimat maksimal 8 kata per soal. "
        "Gunakan hanya kosakata yang biasa didengar anak usia 6-8 tahun. "
        "Konsep harus konkret dan bisa dilihat atau diraba. "
        "DILARANG menggunakan kata: analisis, evaluasi, konsep, prinsip, hipotesis."
    ),
    "Fase B": (
        "Kelas 3-4 SD. Kalimat maksimal 12 kata. Boleh 1 langkah penalaran sederhana. "
        "Konteks harus dekat kehidupan sehari-hari siswa."
    ),
    "Fase C": (
        "Kelas 5-6 SD. Boleh 2 langkah penalaran. Boleh analogi konkret. "
        "Mulai bisa gunakan istilah mata pelajaran dasar."
    ),
    "Fase D": (
        "Kelas 7-9 SMP. Boleh penalaran multi-langkah. Konteks sosial dan sains dasar diperbolehkan. "
        "Istilah akademik boleh digunakan jika disertai konteks yang jelas."
    ),
    "Fase E": (
        "Kelas 10-11 SMA. Analisis dan evaluasi argumen diperbolehkan. "
        "Konteks kompleks dan istilah akademik penuh diperbolehkan."
    ),
    "Fase F": (
        "Kelas 12 SMA atau setara. Sintesis, kreasi, dan evaluasi kritis. "
        "Soal boleh multi-perspektif dan open-ended."
    ),
    "umum": "Sesuaikan kompleksitas bahasa dan konsep dengan konteks materi yang diberikan."
}
```

2. Pada `_build_user_prompt()` dan `_build_regenerate_prompt()`, tambahkan logika pencarian substring sebelum membuat string f-string:
```python
    fase_detail = FASE_GUIDELINES["umum"]
    for fase_key, guideline in FASE_GUIDELINES.items():
        if fase_key in fase_kelas:
            fase_detail = guideline
            break
```

3. Ganti bagian pada string prompt dari:
`Fase/Kelas: {fase_kelas} | Mapel: {mata_pelajaran}`
Menjadi:
```
Mapel: {mata_pelajaran} | Topik: {topik or 'Materi inti'}
Panduan Wajib untuk Fase Ini: {fase_detail}
```
*(Sesuaikan juga untuk fungsi regenerasi tunggal).*

---

### ISS-05 — Ganti `_truncate_content()` dengan `_smart_truncate()` berbasis keyword
Ganti fungsi `_truncate_content` dengan smart chunking berbasis keyword. Topik materi kadang diabaikan jika terpotong dari awal doc.

1. Tambahkan Set ini:
```python
_STOPWORDS = frozenset({
    "dan", "di", "yang", "ini", "itu", "atau", "dengan", "untuk",
    "dari", "ke", "pada", "adalah", "dalam", "tidak", "akan", "juga",
    "sudah", "ada", "bisa", "oleh", "karena", "saat", "jika", "maka",
    "dapat", "lebih", "agar", "namun", "tetapi", "sehingga", "yaitu",
})
```

2. Buat fungsi baru:
```python
def _smart_truncate(
    content: str,
    topik: str = "",
    mata_pelajaran: str = "",
    max_chars: int = MAX_CONTENT_CHARS,
) -> str:
    if len(content) <= max_chars:
        return content

    raw_keywords = (topik + " " + mata_pelajaran).lower().split()
    keywords = [kw for kw in raw_keywords if kw not in _STOPWORDS and len(kw) > 2]

    if not keywords:
        return content[:max_chars] + "\n\n[Konten diringkas]"

    chunk_size = 400
    chunks = [content[i:i + chunk_size] for i in range(0, len(content), chunk_size)]

    def score_chunk(chunk: str) -> int:
        chunk_lower = chunk.lower()
        return sum(chunk_lower.count(kw) for kw in keywords)

    scored_chunks = sorted(enumerate(chunks), key=lambda x: score_chunk(x[1]), reverse=True)
    n_chunks_needed = max_chars // chunk_size
    top_indices = sorted(i for i, _ in scored_chunks[:n_chunks_needed])
    selected_chunks = [chunks[i] for i in top_indices]

    return "\n\n".join(selected_chunks) + "\n\n[Konten diseleksi berdasarkan relevansi topik]"
```

3. Update semua pemanggilan `{_truncate_content(konten_modul)}` di string prompt menjadi `{_smart_truncate(konten_modul, topik=topik, mata_pelajaran=mata_pelajaran)}`. Hapus definisi fungsi `_truncate_content` lama.

---

### ISS-06 — Validasi konten soal + logika Partial Success
1. Buat fungsi validasi setelah parser:
```python
def _validate_soal_item(soal: dict, tipe_soal: str) -> tuple[bool, str]:
    pertanyaan = soal.get("pertanyaan", "").strip()
    if not pertanyaan or pertanyaan == "...":
        return False, "pertanyaan kosong/placeholder"

    jawaban = soal.get("jawaban", "").strip()
    if not jawaban or jawaban == "...":
        return False, "jawaban kosong/placeholder"

    if tipe_soal in ["pilihan_ganda", "campuran"]:
        pilihan = soal.get("pilihan", [])
        if len(pilihan) < 4:
            return False, f"pilihan kurang dari 4"
        
        jawaban_huruf = jawaban[0].upper() if jawaban else ""
        if jawaban_huruf not in {"A", "B", "C", "D"}:
            return False, f"jawaban bukan A/B/C/D"

        pilihan_stripped = [p.strip() for p in pilihan]
        if len(set(pilihan_stripped)) == 1:
            return False, "semua pilihan identik"

    return True, "ok"
```

2. Pada `generate_soal()` dan `regenerate_single_soal()`, implementasikan validasi.
**(Revisi Senior Agent: Karena fungsi provider sudah ada `max_retries=3`, kita HARUS passing `max_retries=1` secara eksplisit saat dipanggil di dalam loop orchestrator, agar tidak terjadi double retry. Contoh:** `await _generate_with_groq(prompt, api_key, max_retries=1)`**)**.

```python
    last_error: Exception | None = None

    for attempt in range(max_retries):
        try:
            if provider == "groq":
                response_text = await _generate_with_groq(prompt, api_key, max_retries=1)
            elif provider == "openrouter":
                response_text = await _generate_with_openrouter(prompt, api_key, max_retries=1)
            else:
                response_text = await _generate_with_gemini(prompt, api_key, max_retries=1)

            soal_list = _parse_ai_response(response_text)
            
            valid_soal = []
            for soal in soal_list:
                is_valid, reason = _validate_soal_item(soal, tipe_soal)
                if is_valid:
                    valid_soal.append(soal)
                else:
                    print(f"[WARN] Soal #{soal.get('nomor', '?')} dibuang: {reason}")

            threshold = max(1, int(jumlah_soal * 0.7))
            if len(valid_soal) >= threshold:
                return valid_soal

            last_error = ValueError(f"Hanya {len(valid_soal)}/{jumlah_soal} valid (min {threshold}). Retry...")
            
        except Exception as e:
            last_error = e

        if attempt < max_retries - 1:
            await asyncio.sleep(2 ** attempt)

    raise RuntimeError(f"Gagal menghasilkan soal yang cukup valid. Error terakhir: {last_error}")
```

Sesuaikan juga untuk `regenerate_single_soal()` di mana `threshold = 1`.

---

## Acceptance Criteria
- [ ] Berjalan di branch `feature/issue-22`.
- [ ] Semua poin (ISS-01 s/d ISS-06) sudah diimplementasikan di `ai_service.py` sesuai revisi di atas (Terutama fix `fase_kelas` format dan `temperature` Gemini!).
- [ ] Lakukan testing memastikan endpoint generate soal dapat menerima JSON dan tidak nyangkut.
- [ ] Status issue ini diubah jadi **Done** jika PR sudah merged, dan jangan lupa buat review lokal di `.agent/reviews/PR-ISSUE-22.md`.
