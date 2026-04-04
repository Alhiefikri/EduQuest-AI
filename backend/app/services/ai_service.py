import json
import time
from typing import List

SYSTEM_PROMPT = """Kamu adalah pendidik profesional yang ahli dalam evaluasi pembelajaran Kurikulum Merdeka. Tugasmu adalah membuat soal evaluasi yang valid, berpusat pada materi pokok, sesuai dengan perkembangan kognitif siswa, dan menggunakan bahasa yang mudah dipahami sesuai tingkat kelas yang diminta."""

MAX_CONTENT_CHARS = 12000


def _truncate_content(content: str, max_chars: int = MAX_CONTENT_CHARS) -> str:
    if len(content) <= max_chars:
        return content
    truncated = content[:max_chars]
    last_period = truncated.rfind(".")
    if last_period > max_chars * 0.8:
        truncated = truncated[:last_period + 1]
    return truncated + "\n\n[Konten diringkas karena terlalu panjang]"


async def _get_ai_config() -> tuple[str, str]:
    from app.config import get_ai_config as _get_config
    return await _get_config()


def _build_user_prompt(
    jumlah_soal: int,
    tipe_soal: str,
    mata_pelajaran: str,
    topik: str,
    difficulty: str,
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

    prompt = f"""Buat {jumlah_soal} soal {tipe_label.get(tipe_soal, tipe_soal)} berdasarkan parameter berikut:

Fase/Kelas: {fase_kelas}
Mata Pelajaran: {mata_pelajaran}
Tujuan Pembelajaran / Topik: {topik if topik else "Sesuaikan dengan materi"}
Ringkasan Materi:
{_truncate_content(konten_modul)}

Level Kognitif: {difficulty_instruction.get(difficulty, difficulty)}

Syarat mutlak:
- Fokus murni pada evaluasi penguasaan materi, bukan aktivitas belajar mengajar di kelas.
- Bahasa harus disesuaikan untuk anak-anak sekolah/siswa.
- KHUSUS Fase A (Kelas 1-2): Gunakan kalimat sangat pendek, kosakata dasar, dan konsep konkret yang mudah dibayangkan.
- Jangan tambahkan teks pengantar atau penutup apa pun.
- Output HANYA berupa JSON valid dengan skema berikut:

{{
  "soal": [
    {{
      "nomor": 1,
      "pertanyaan": "...",
      "pilihan": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "jawaban": "B",
      "pembahasan": "...",
      "gambar_prompt": "Deskripsi visual sederhana untuk ilustrasi soal ini (WAJIB ADA jika konfigurasi gambar AKTIF)"
    }}
  ]
}}

PENTING:
- Field "gambar_prompt" HARUS diisi dengan deskripsi visual yang relevan jika include_gambar adalah True.
- Untuk soal isian/essay, field "pilihan" boleh kosong [] dan "jawaban" berisi kunci jawaban singkat
- Pastikan soal benar-benar berdasarkan materi yang diberikan
- Jawaban harus akurat dan pembahasan jelas"""

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

    data = json.loads(cleaned)

    if isinstance(data, dict) and "soal" in data:
        return data["soal"]

    if isinstance(data, list):
        return data

    raise ValueError("Format respons AI tidak dikenali")


def _generate_with_gemini(
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
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt,
                config=config,
            )
            return response.text

        except ServerError:
            wait_time = 2 ** (attempt + 1)
            time.sleep(wait_time)
            continue

        except (json.JSONDecodeError, ValueError) as e:
            if attempt == max_retries - 1:
                raise ValueError(f"Gagal memparsing respons AI setelah {max_retries} percobaan: {str(e)}")
            time.sleep(2)
            continue

        except Exception as e:
            if attempt == max_retries - 1:
                raise RuntimeError(f"Gagal menghubungi layanan Gemini: {str(e)}")
            time.sleep(2)
            continue

    raise RuntimeError("Gagal menghasilkan respons dari Gemini setelah beberapa percobaan")


def _generate_with_groq(
    prompt: str,
    api_key: str,
    max_retries: int = 3,
) -> str:
    from groq import Groq

    client = Groq(api_key=api_key)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
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
                time.sleep(wait_time)
                continue

            if attempt == max_retries - 1:
                raise RuntimeError(f"Gagal menghubungi layanan Groq: {str(e)}")
            time.sleep(2)
            continue

    raise RuntimeError("Gagal menghasilkan respons dari Groq setelah beberapa percobaan")


async def generate_soal(
    jumlah_soal: int,
    tipe_soal: str,
    mata_pelajaran: str,
    difficulty: str,
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
        include_pembahasan=include_pembahasan,
        include_gambar=include_gambar,
        konten_modul=konten_modul,
        fase_kelas=fase_kelas,
    )

    provider, api_key = await _get_ai_config()

    if not api_key:
        raise RuntimeError("API key belum dikonfigurasi. Silakan atur di halaman Settings.")

    if provider == "groq":
        response_text = _generate_with_groq(prompt, api_key, max_retries)
    else:
        response_text = _generate_with_gemini(prompt, api_key, max_retries)

    soal_list = _parse_ai_response(response_text)

    if not soal_list:
        raise ValueError("AI menghasilkan daftar soal kosong")

    return soal_list


def test_ai_connection(provider: str, api_key: str) -> str:
    if not api_key:
        raise ValueError("API key tidak boleh kosong")

    if provider == "groq":
        _generate_with_groq("Respond with exactly: {\"status\": \"ok\"}", api_key, max_retries=1)
    else:
        _generate_with_gemini("Respond with exactly: {\"status\": \"ok\"}", api_key, max_retries=1)

    return "Koneksi berhasil"
