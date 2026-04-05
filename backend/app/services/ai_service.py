from enum import Enum
import json
import asyncio
from typing import List, Optional


class TipeKonten(str, Enum):
    modul_ajar = "modul_ajar"
    cp_tp = "cp_tp"
    input_manual = "input_manual"


SYSTEM_PROMPT = """Kamu adalah sistem pembuat soal ujian untuk Kurikulum Merdeka Indonesia.

ATURAN MUTLAK — TIDAK BOLEH DILANGGAR:
1. Soal HANYA boleh dibuat berdasarkan teks materi yang diberikan di bagian "Materi:" dalam prompt.
2. DILARANG KERAS menambahkan fakta, konsep, contoh, atau informasi dari luar teks materi tersebut.
3. DILARANG membuat soal tentang cara mengajar, metode pembelajaran, atau alat peraga guru.
4. Jika teks materi tidak cukup untuk membuat jumlah soal yang diminta, hasilkan soal sebanyak yang bisa dibuat dari materi — jangan mengarang untuk memenuhi kuota.
5. Output HANYA berupa JSON valid. Tidak ada kalimat pembuka, penutup, atau penjelasan apapun."""

# TODO: Implementasi ekstraksi PDF berdasarkan rentang halaman di layer controller untuk optimasi lebih lanjut
MAX_CONTENT_CHARS = 8000

FASE_GUIDELINES: dict[str, str] = {
    "Fase A": (
        "Kelas 1-2 SD. WAJIB: kalimat maksimal 8 kata per soal. "
        "Gunakan hanya kosakata yang biasa didengar anak usia 6-8 tahun. "
        "Konsep harus konkret dan bisa dilihat atau diraba. "
        "DILARANG menggunakan kata: analisis, evaluasi, konsep, prinsip, hipotesis. "
        "Contoh BENAR: 'Apa warna daun yang sehat?' "
        "Contoh SALAH: 'Jelaskan proses fotosintesis secara terperinci!'"
    ),
    "Fase B": (
        "Kelas 3-4 SD. Kalimat maksimal 12 kata. Boleh 1 langkah penalaran sederhana. "
        "Konteks harus dekat kehidupan sehari-hari siswa."
    ),
    "Fase C": (
        "Kelas 5-6 SD. Boleh 2 langkah penalaran. Boleh analogi konkret. "
        "Mulai bisa gunakan istilah mata pelajaran dasar. "
        "DILARANG menggunakan kata: karakteristik, komprehensif, hipotesis, implikasi, fundamental. "
        "Contoh BENAR: 'Sebuah kotak panjang 10 cm, lebar 5 cm, tinggi 4 cm. Berapa volumenya?' "
        "Contoh SALAH: 'Analisislah karakteristik dimensi bangun ruang secara komprehensif.'"
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

_STOPWORDS = frozenset({
    "dan", "di", "yang", "ini", "itu", "atau", "dengan", "untuk",
    "dari", "ke", "pada", "adalah", "dalam", "tidak", "akan", "juga",
    "sudah", "ada", "bisa", "oleh", "karena", "saat", "jika", "maka",
    "dapat", "lebih", "agar", "namun", "tetapi", "sehingga", "yaitu",
})


# --- UTILITY FUNCTIONS ---

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

    scored_chunks = sorted(
        enumerate(chunks),
        key=lambda x: score_chunk(x[1]),
        reverse=True,
    )
    n_chunks_needed = max_chars // chunk_size
    top_indices = sorted(i for i, _ in scored_chunks[:n_chunks_needed])
    selected_chunks = [chunks[i] for i in top_indices]

    return "\n\n".join(selected_chunks) + "\n\n[Konten diseleksi berdasarkan relevansi topik]"


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

    cp_tp_score = sum(1 for m in cp_tp_markers if m in konten_lower)
    modul_score = sum(1 for m in modul_markers if m in konten_lower)

    # Butuh minimal 2 penanda kuat CP/TP untuk diklasifikasi cp_tp
    # (mencegah modul ajar dengan pendahuluan standar salah klasifikasi)
    if cp_tp_score >= 2 and cp_tp_score > modul_score:
        return TipeKonten.cp_tp.value

    return TipeKonten.modul_ajar.value


def _get_fase_detail(fase_kelas: str) -> str:
    fase_detail = FASE_GUIDELINES["umum"]
    for fase_key, guideline in FASE_GUIDELINES.items():
        if fase_key in fase_kelas:
            fase_detail = guideline
            break
    return fase_detail


async def _get_ai_config() -> tuple[str, str]:
    from app.config import get_ai_config as _get_config
    return await _get_config()


def _get_bloom_instruction(bloom_levels: List[str]) -> str:
    bloom_map = {
        "C1": "C1 Mengingat (recall fakta, istilah, konsep dasar)",
        "C2": "C2 Memahami (menjelaskan ide atau konsep)",
        "C3": "C3 Menerapkan (menggunakan informasi dalam situasi baru)",
        "C4": "C4 Menganalisis (memecah informasi untuk melihat hubungan/struktur)",
        "C5": "C5 Mengevaluasi (menjustifikasi keputusan atau tindakan)",
        "C6": "C6 Mencipta (menghasilkan karya baru atau orisinal)"
    }
    
    if not bloom_levels:
        return ""
        
    instructions = [bloom_map[b] for b in bloom_levels if b in bloom_map]
    if not instructions:
        return ""
        
    return "Level Kognitif (Taksonomi Bloom): " + ", ".join(instructions) + ". "


def _get_gaya_instruction(gaya_soal: List[str]) -> str:
    gaya_map = {
        "light_story": "Cerita Ringan (berikan konteks berupa cerita/skenario sehari-hari)",
        "formal_academic": "Akademik Formal (bahasa baku, lugas, fokus teori/fakta)",
        "case_study": "Studi Kasus (analisis situasi/kasus nyata relevan)",
        "standard_exam": "Ujian Standar (singkat, padat, jelas seperti UN/SNBT)",
        "hots": "HOTS (Higher Order Thinking Skills - menguji analisis, evaluasi, dan kreasi)"
    }

    if not gaya_soal:
        return gaya_map["formal_academic"]

    instructions = []
    for g in gaya_soal:
        if g in gaya_map:
            instructions.append(gaya_map[g])

    if not instructions:
        return gaya_map["formal_academic"]

    return "Gabungan Gaya: " + ", ".join(instructions) + ". Pastikan soal mencerminkan kombinasi elemen-elemen tersebut."


# --- PROMPT BUILDERS ---

def _build_cp_tp_section(konten_cp_tp: str, mata_pelajaran: str, topik: str) -> str:
    konten_terpilih = _smart_truncate(
        konten_cp_tp,
        topik=topik,
        mata_pelajaran=mata_pelajaran,
    )
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


def _build_user_prompt(
    jumlah_soal: int,
    tipe_soal: str,
    mata_pelajaran: str,
    topik: str,
    difficulty: str,
    gaya_soal: List[str],
    include_pembahasan: bool,
    include_gambar: bool,
    konten_modul: str,
    fase_kelas: str = "umum",
    tipe_konten: TipeKonten = TipeKonten.modul_ajar,
    bloom_levels: Optional[List[str]] = None,
) -> str:
    tipe_label = {
        "pilihan_ganda": "pilihan ganda (4 opsi: A, B, C, D)",
        "isian": "isian singkat",
        "essay": "essay/uraian",
        "campuran": "campuran pilihan ganda, isian, dan essay",
    }

    difficulty_instruction = {
        "mudah": "tingkat dasar, menguji pemahaman konsep sederhana",
        "sedang": "tingkat menengah, menguji penerapan konsep",
        "sulit": "tingkat lanjut, menguji analisis dan evaluasi",
        "campuran": "distribusi merata antara mudah, sedang, dan sulit",
    }

    gaya_instruction = _get_gaya_instruction(gaya_soal)
    bloom_instruction = _get_bloom_instruction(bloom_levels or [])
    fase_detail = _get_fase_detail(fase_kelas)

    if tipe_konten == TipeKonten.cp_tp:
        materi_section = _build_cp_tp_section(konten_modul, mata_pelajaran, topik)
    else:
        materi_section = _smart_truncate(konten_modul, topik=topik, mata_pelajaran=mata_pelajaran)

    # Dynamic JSON Schema
    json_item = {
        "nomor": 1,
        "pertanyaan": "...",
    }
    if tipe_soal in ["pilihan_ganda", "campuran"]:
        json_item["pilihan"] = ["A. ...", "B. ...", "C. ...", "D. ..."]

    json_item["jawaban"] = "..."

    if include_pembahasan:
        json_item["pembahasan"] = "..."

    if include_gambar:
        json_item["gambar_prompt"] = "Deskripsi visual sederhana untuk ilustrasi soal ini"

    schema_str = json.dumps({"soal": [json_item]}, indent=2)

    prompt = f"""Buat {jumlah_soal} soal {tipe_label.get(tipe_soal, tipe_soal)}:
Mapel: {mata_pelajaran} | Topik: {topik or 'Materi inti'}
Panduan Wajib untuk Fase Ini: {fase_detail}
Gaya: {gaya_instruction} | Level: {difficulty_instruction.get(difficulty, difficulty)}
{bloom_instruction}

Materi:
{materi_section}

Aturan Wajib:
1. FOKUS materi inti. JANGAN buat soal tentang metode/alat peraga guru.
2. Bahasa sesuai tingkat siswa.
3. Output HANYA JSON valid sesuai skema: {schema_str}
4. Distribusikan soal secara merata ke semua topik/unit yang ada di materi. \
Jangan buat semua soal dari satu topik saja meskipun topik itu paling panjang.
5. Jawaban akurat & pembahasan jelas. No intro/outro."""

    return prompt


def _build_regenerate_prompt(
    soal_lama: dict,
    tipe_soal: str,
    mata_pelajaran: str,
    topik: str,
    difficulty: str,
    gaya_soal: List[str],
    include_pembahasan: bool,
    include_gambar: bool,
    konten_modul: str,
    fase_kelas: str = "umum",
    feedback_user: str = None,
    tipe_konten: TipeKonten = TipeKonten.modul_ajar,
    bloom_levels: Optional[List[str]] = None,
) -> str:
    tipe_label = {
        "pilihan_ganda": "pilihan ganda (4 opsi: A, B, C, D)",
        "isian": "isian singkat",
        "essay": "essay/uraian",
        "campuran": "campuran pilihan ganda, isian, dan essay",
    }

    difficulty_instruction = {
        "mudah": "tingkat dasar, menguji pemahaman konsep sederhana",
        "sedang": "tingkat menengah, menguji penerapan konsep",
        "sulit": "tingkat lanjut, menguji analisis dan evaluasi",
        "campuran": "distribusi merata antara mudah, sedang, dan sulit",
    }

    gaya_instruction = _get_gaya_instruction(gaya_soal)
    fase_detail = _get_fase_detail(fase_kelas)

    if tipe_konten == TipeKonten.cp_tp:
        materi_section = _build_cp_tp_section(konten_modul, mata_pelajaran, topik)
    else:
        materi_section = _smart_truncate(konten_modul, topik=topik, mata_pelajaran=mata_pelajaran)

    # Dynamic JSON Schema
    json_item = {
        "nomor": soal_lama.get("nomor", 1),
        "pertanyaan": "...",
    }
    if tipe_soal in ["pilihan_ganda", "campuran"]:
        json_item["pilihan"] = ["A. ...", "B. ...", "C. ...", "D. ..."]

    json_item["jawaban"] = "..."

    if include_pembahasan:
        json_item["pembahasan"] = "..."

    if include_gambar:
        json_item["gambar_prompt"] = "Deskripsi visual sederhana untuk ilustrasi soal ini"

    schema_str = json.dumps({"soal": [json_item]}, indent=2)

    soal_lama_str = json.dumps(soal_lama, indent=2, ensure_ascii=False)

    feedback_section = f"\nInstruksi Khusus dari Guru (Wajib Diikuti):\n{feedback_user}\n" if feedback_user else ""

    prompt = f"""Buat 1 soal BARU yang BERBEDA dari soal lama berikut, tetap berdasarkan materi yang sama.

Soal Lama:
{soal_lama_str}

Parameter Soal Baru:
Mapel: {mata_pelajaran} | Topik: {topik if topik else "Sesuaikan dengan materi"}
Panduan Wajib untuk Fase Ini: {fase_detail}
Gaya Soal: {gaya_instruction} | Level: {difficulty_instruction.get(difficulty, difficulty)}
{_get_bloom_instruction(bloom_levels or [])}
Tipe Soal: {tipe_label.get(tipe_soal, tipe_soal)}
{feedback_section}
Ringkasan Materi:
{materi_section}

Instruksi Khusus (Wajib Dipatuhi):
1. **DILARANG KERAS** membuat soal tentang kegiatan belajar di kelas, metode mengajar guru, langkah-langkah pembelajaran, atau alat peraga yang digunakan guru.
2. **FOKUS HANYA** pada materi/fakta/konsep yang harus dikuasai oleh siswa.
3. Terapkan instruksi "Gaya Soal" yang tercantum pada Parameter Soal secara konsisten pada pertanyaan.
4. Output HANYA berupa JSON valid sesuai skema berikut:

{schema_str}

PENTING:
- Jangan tambahkan teks pengantar atau penutup apa pun.
- Pastikan soal benar-benar berdasarkan materi yang diberikan.
- Jawaban harus akurat dan pembahasan jelas."""

    # Catatan: tidak ada instruksi distribusi soal di sini karena regenerate hanya menghasilkan 1 soal pengganti, bukan batch.
    return prompt


# --- AI LOGIC (Parsers & Validators) ---

def _parse_ai_response(response_text: str) -> List[dict]:
    cleaned = response_text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]  # type: ignore
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]  # type: ignore
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]  # type: ignore

    cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: coba cari JSON di dalam string jika model cerewet
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1:
            data = json.loads(cleaned[start:end+1])  # type: ignore
        else:
            raise

    if isinstance(data, dict) and "soal" in data:
        return data["soal"]

    if isinstance(data, list):
        return data

    raise ValueError("Format respons AI tidak dikenali")


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
            return False, "pilihan kurang dari 4"

        jawaban_huruf = jawaban[0].upper() if jawaban else ""
        if jawaban_huruf not in {"A", "B", "C", "D"}:
            return False, "jawaban bukan A/B/C/D"

        pilihan_stripped = [p.strip() for p in pilihan]
        if len(set(pilihan_stripped)) == 1:
            return False, "semua pilihan identik"

    return True, "ok"


# --- AI PROVIDERS ---

async def _generate_with_gemini(
    prompt: str,
    api_key: str,
    max_retries: int = 3,
) -> str:
    from google import genai
    from google.genai import types
    from google.genai.errors import ServerError

    client = genai.Client(api_key=api_key)

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=0.3,
        max_output_tokens=8192,
        response_mime_type="application/json",
    )

    for attempt in range(max_retries):
        try:
            # Menggunakan client.aio untuk async request
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt,
                config=config,
            )
            return response.text

        except ServerError:
            wait_time = 2 ** (attempt + 1)
            await asyncio.sleep(wait_time)
            continue

        except (json.JSONDecodeError, ValueError) as e:
            if attempt == max_retries - 1:
                raise ValueError(f"Gagal memparsing respons AI setelah {max_retries} percobaan: {str(e)}")
            await asyncio.sleep(2)
            continue

        except Exception as e:
            if attempt == max_retries - 1:
                raise RuntimeError(f"Gagal menghubungi layanan Gemini: {str(e)}")
            await asyncio.sleep(2)
            continue

    raise RuntimeError("Gagal menghasilkan respons dari Gemini setelah beberapa percobaan")


async def _generate_with_groq(
    prompt: str,
    api_key: str,
    max_retries: int = 3,
) -> str:
    from groq import AsyncGroq

    client = AsyncGroq(api_key=api_key)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    for attempt in range(max_retries):
        try:
            response = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.3,
                max_tokens=4096,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content or ""

        except Exception as e:
            error_msg = str(e).lower()
            if "rate_limit" in error_msg or "429" in error_msg:
                wait_time = 2 ** (attempt + 1)
                await asyncio.sleep(wait_time)
                continue

            if attempt == max_retries - 1:
                raise RuntimeError(f"Gagal menghubungi layanan Groq: {str(e)}")
            await asyncio.sleep(2)
            continue

    raise RuntimeError("Gagal menghasilkan respons dari Groq setelah beberapa percobaan")


async def _generate_with_openrouter(
    prompt: str,
    api_key: str,
    max_retries: int = 3,
) -> str:
    from openrouter import OpenRouter  # type: ignore
    # Model specified in ISSUE-39
    model = "qwen/qwen3.6-plus:free"

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    for attempt in range(max_retries):
        try:
            # Gunakan context manager untuk menghindari kebocoran memori (memory leak)
            async with OpenRouter(
                api_key=api_key,
                http_referer="https://github.com/Alhiefikri/EduQuest-AI",
                x_open_router_title="EduQuest AI"
            ) as client:
                # Menggunakan fungsi 'send_async' dari official SDK
                response = await client.chat.send_async(                    model=model,
                    messages=messages,
                    temperature=0.2,
                    top_p=0.85,
                    max_tokens=4096,
                )
                return response.choices[0].message.content or ""

        except Exception as e:
            error_msg = str(e).lower()
            if "rate_limit" in error_msg or "429" in error_msg:
                wait_time = 2 ** (attempt + 1)
                await asyncio.sleep(wait_time)
                continue

            if attempt == max_retries - 1:
                raise RuntimeError(f"Gagal menghubungi layanan OpenRouter (Native SDK): {str(e)}")
            await asyncio.sleep(2)
            continue

    raise RuntimeError("Gagal menghasilkan respons dari OpenRouter setelah beberapa percobaan")


# --- ORCHESTRATORS ---

async def generate_soal(
    jumlah_soal: int,
    tipe_soal: str,
    mata_pelajaran: str,
    difficulty: str,
    gaya_soal: List[str],
    include_pembahasan: bool,
    include_gambar: bool,
    konten_modul: str,
    topik: str = "",
    fase_kelas: str = "umum",
    tipe_konten: Optional[TipeKonten] = None,
    max_retries: int = 3,
    bloom_levels: Optional[List[str]] = None,
) -> List[dict]:
    if tipe_konten is None:
        tipe_konten = TipeKonten(_detect_tipe_konten(konten_modul))

    prompt = _build_user_prompt(
        jumlah_soal=jumlah_soal,
        tipe_soal=tipe_soal,
        mata_pelajaran=mata_pelajaran,
        topik=topik,
        difficulty=difficulty,
        gaya_soal=gaya_soal,
        include_pembahasan=include_pembahasan,
        include_gambar=include_gambar,
        konten_modul=konten_modul,
        fase_kelas=fase_kelas,
        tipe_konten=tipe_konten,
        bloom_levels=bloom_levels,
    )

    provider, api_key = await _get_ai_config()

    if not api_key:
        raise RuntimeError("API key belum dikonfigurasi. Silakan atur di halaman Settings.")

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


async def regenerate_single_soal(
    soal_lama: dict,
    tipe_soal: str,
    mata_pelajaran: str,
    difficulty: str,
    gaya_soal: List[str],
    include_pembahasan: bool,
    include_gambar: bool,
    konten_modul: str,
    topik: str = "",
    fase_kelas: str = "umum",
    feedback_user: str = None,
    tipe_konten: Optional[TipeKonten] = None,
    max_retries: int = 3,
    bloom_levels: Optional[List[str]] = None,
) -> dict:
    if tipe_konten is None:
        tipe_konten = TipeKonten(_detect_tipe_konten(konten_modul))

    prompt = _build_regenerate_prompt(
        soal_lama=soal_lama,
        tipe_soal=tipe_soal,
        mata_pelajaran=mata_pelajaran,
        topik=topik,
        difficulty=difficulty,
        gaya_soal=gaya_soal,
        include_pembahasan=include_pembahasan,
        include_gambar=include_gambar,
        konten_modul=konten_modul,
        fase_kelas=fase_kelas,
        feedback_user=feedback_user,
        tipe_konten=tipe_konten,
        bloom_levels=bloom_levels,
    )

    provider, api_key = await _get_ai_config()

    if not api_key:
        raise RuntimeError("API key belum dikonfigurasi. Silakan atur di halaman Settings.")

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

            if soal_list and len(soal_list) > 0:
                is_valid, reason = _validate_soal_item(soal_list[0], tipe_soal)
                if is_valid:
                    return soal_list[0]
                print(f"[WARN] Soal regenerasi dibuang: {reason}")

            last_error = ValueError("Soal regenerasi tidak valid")

        except Exception as e:
            last_error = e

        if attempt < max_retries - 1:
            await asyncio.sleep(2 ** attempt)

    raise RuntimeError(f"Gagal menghasilkan soal pengganti yang valid. Error terakhir: {last_error}")


# --- HELPERS ---

async def test_ai_connection(provider: str, api_key: str) -> str:
    if not api_key:
        raise ValueError("API key tidak boleh kosong")

    if provider == "groq":
        await _generate_with_groq("Respond with exactly: {\"status\": \"ok\"}", api_key, max_retries=1)
    elif provider == "openrouter":
        await _generate_with_openrouter("Respond with exactly: {\"status\": \"ok\"}", api_key, max_retries=1)
    else:
        await _generate_with_gemini("Respond with exactly: {\"status\": \"ok\"}", api_key, max_retries=1)

    return "Koneksi berhasil"
