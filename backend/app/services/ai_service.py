import json
import asyncio
from typing import List, Optional
from openai import AsyncOpenAI

SYSTEM_PROMPT = """Kamu adalah pendidik profesional yang ahli dalam evaluasi pembelajaran Kurikulum Merdeka. 
Tugasmu adalah membuat soal evaluasi yang valid, berpusat pada materi pokok, sesuai dengan perkembangan kognitif siswa, 
dan menggunakan bahasa yang mudah dipahami sesuai tingkat kelas yang diminta. 
Gunakan nada yang memotivasi dan edukatif."""

# TODO: Implementasi ekstraksi PDF berdasarkan rentang halaman di layer controller untuk optimasi lebih lanjut
MAX_CONTENT_CHARS = 8000


def _truncate_content(content: str, max_chars: int = MAX_CONTENT_CHARS) -> str:
    if len(content) <= max_chars:
        return content
    truncated = content[:max_chars]
    last_period = truncated.rfind(".")
    if last_period > max_chars * 0.8:
        truncated = truncated[:last_period + 1]
    return truncated + "\n\n[Konten diringkas agar fokus pada materi inti]"


async def _get_ai_config() -> tuple[str, str]:
    from app.config import get_ai_config as _get_config
    return await _get_config()


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

    prompt = f"""Buat {jumlah_soal} soal {tipe_label.get(tipe_soal, tipe_soal)} berdasarkan parameter berikut:

Fase/Kelas: {fase_kelas}
Mata Pelajaran: {mata_pelajaran}
Tujuan Pembelajaran / Topik: {topik if topik else "Sesuaikan dengan materi"}
Gaya Soal: {gaya_instruction}
Level Kognitif: {difficulty_instruction.get(difficulty, difficulty)}

Ringkasan Materi:
{_truncate_content(konten_modul)}

Instruksi Khusus (Wajib Dipatuhi):
1. **DILARANG KERAS** membuat soal tentang kegiatan belajar di kelas, metode mengajar guru, langkah-langkah pembelajaran, atau alat peraga yang digunakan guru.
2. **FOKUS HANYA** pada materi/fakta/konsep yang harus dikuasai oleh siswa.
3. Bahasa harus disesuaikan untuk anak-anak sekolah/siswa.
4. KHUSUS Fase A (Kelas 1-2): Gunakan kalimat sangat pendek, kosakata dasar, dan konsep konkret.
5. Terapkan instruksi "Gaya Soal" yang tercantum pada Parameter Soal secara konsisten pada pertanyaan.
6. Output HANYA berupa JSON valid sesuai skema berikut:

{schema_str}

PENTING:
- Jangan tambahkan teks pengantar atau penutup apa pun.
- Pastikan soal benar-benar berdasarkan materi yang diberikan.
- Jawaban harus akurat dan pembahasan jelas."""

    return prompt


def _parse_ai_response(response_text: str) -> List[dict]:
    cleaned = response_text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: coba cari JSON di dalam string jika model cerewet
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1:
            data = json.loads(cleaned[start:end+1])
        else:
            raise

    if isinstance(data, dict) and "soal" in data:
        return data["soal"]

    if isinstance(data, list):
        return data

    raise ValueError("Format respons AI tidak dikenali")


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
        temperature=0.7,
        max_output_tokens=8192,
        response_mime_type="application/json",
    )

    for attempt in range(max_retries):
        try:
            # Menggunakan client.aio untuk async request
            response = await client.aio.models.generate_content(
                model="gemini-1.5-flash",
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
                temperature=0.7,
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
    # Model specified in ISSUE-39
    model = "qwen/qwen-3.6-plus:free"
    
    client = AsyncOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    for attempt in range(max_retries):
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                # OpenRouter extra headers often recommended for identification
                extra_headers={
                    "HTTP-Referer": "https://github.com/Alhiefikri/EduQuest-AI",
                    "X-Title": "EduQuest AI",
                }
            )
            return response.choices[0].message.content or ""

        except Exception as e:
            error_msg = str(e).lower()
            if "rate_limit" in error_msg or "429" in error_msg:
                wait_time = 2 ** (attempt + 1)
                await asyncio.sleep(wait_time)
                continue

            if attempt == max_retries - 1:
                raise RuntimeError(f"Gagal menghubungi layanan OpenRouter: {str(e)}")
            await asyncio.sleep(2)
            continue

    raise RuntimeError("Gagal menghasilkan respons dari OpenRouter setelah beberapa percobaan")


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
    max_retries: int = 3,
) -> List[dict]:
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
    )

    provider, api_key = await _get_ai_config()

    if not api_key:
        raise RuntimeError("API key belum dikonfigurasi. Silakan atur di halaman Settings.")

    if provider == "groq":
        response_text = await _generate_with_groq(prompt, api_key, max_retries)
    elif provider == "openrouter":
        response_text = await _generate_with_openrouter(prompt, api_key, max_retries)
    else:
        response_text = await _generate_with_gemini(prompt, api_key, max_retries)

    soal_list = _parse_ai_response(response_text)

    if not soal_list:
        raise ValueError("AI menghasilkan daftar soal kosong")

    return soal_list


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
Fase/Kelas: {fase_kelas}
Mata Pelajaran: {mata_pelajaran}
Tujuan Pembelajaran / Topik: {topik if topik else "Sesuaikan dengan materi"}
Gaya Soal: {gaya_instruction}
Level Kognitif: {difficulty_instruction.get(difficulty, difficulty)}
Tipe Soal: {tipe_label.get(tipe_soal, tipe_soal)}
{feedback_section}
Ringkasan Materi:
{_truncate_content(konten_modul)}

Instruksi Khusus (Wajib Dipatuhi):
1. **DILARANG KERAS** membuat soal tentang kegiatan belajar di kelas, metode mengajar guru, langkah-langkah pembelajaran, atau alat peraga yang digunakan guru.
2. **FOKUS HANYA** pada materi/fakta/konsep yang harus dikuasai oleh siswa.
3. Bahasa harus disesuaikan untuk anak-anak sekolah/siswa.
4. KHUSUS Fase A (Kelas 1-2): Gunakan kalimat sangat pendek, kosakata dasar, dan konsep konkret.
5. Terapkan instruksi "Gaya Soal" yang tercantum pada Parameter Soal secara konsisten pada pertanyaan.
6. Output HANYA berupa JSON valid sesuai skema berikut:

{schema_str}

PENTING:
- Jangan tambahkan teks pengantar atau penutup apa pun.
- Pastikan soal benar-benar berdasarkan materi yang diberikan.
- Jawaban harus akurat dan pembahasan jelas."""

    return prompt


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
    max_retries: int = 3,
) -> dict:
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
    )

    provider, api_key = await _get_ai_config()

    if not api_key:
        raise RuntimeError("API key belum dikonfigurasi. Silakan atur di halaman Settings.")

    if provider == "groq":
        response_text = await _generate_with_groq(prompt, api_key, max_retries)
    elif provider == "openrouter":
        response_text = await _generate_with_openrouter(prompt, api_key, max_retries)
    else:
        response_text = await _generate_with_gemini(prompt, api_key, max_retries)

    soal_list = _parse_ai_response(response_text)

    if not soal_list or len(soal_list) == 0:
        raise ValueError("AI gagal menghasilkan soal pengganti")

    return soal_list[0]


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
