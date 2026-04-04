import json
import time
from typing import List

from app.config import AI_PROVIDER, GEMINI_API_KEY, GROQ_API_KEY

SYSTEM_PROMPT = """Anda adalah guru berpengalaman yang ahli dalam membuat soal pelajaran.
Buat soal berdasarkan KONTEN MODUL yang diberikan, BUKAN dari pengetahuan umum Anda.
Pastikan soal relevan dengan materi, akurat, dan sesuai tingkat kesulitan.
Output HANYA dalam format JSON yang valid, tanpa teks tambahan sebelum atau sesudah JSON."""


def _build_user_prompt(
    jumlah_soal: int,
    tipe_soal: str,
    mata_pelajaran: str,
    topik: str,
    difficulty: str,
    include_pembahasan: bool,
    include_gambar: bool,
    konten_modul: str,
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

    prompt = f"""Buat {jumlah_soal} soal {tipe_label.get(tipe_soal, tipe_soal)} berdasarkan materi berikut:

MATERI:
{konten_modul}

KONFIGURASI:
- Mata pelajaran: {mata_pelajaran}
- Topik: {topik if topik else "Sesuaikan dengan materi"}
- Tingkat kesulitan: {difficulty_instruction.get(difficulty, difficulty)}
- Sertakan pembahasan: {"Ya" if include_pembahasan else "Tidak"}
- Sertakan gambar: {"Ya, berikan deskripsi gambar yang relevan" if include_gambar else "Tidak"}
- Bahasa: Indonesia

OUTPUT FORMAT (JSON):
{{
  "soal": [
    {{
      "nomor": 1,
      "pertanyaan": "...",
      "pilihan": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "jawaban": "B",
      "pembahasan": "...",
      "gambar_prompt": "deskripsi gambar jika perlu"
    }}
  ]
}}

PENTING:
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
    max_retries: int = 3,
) -> str:
    from google import genai
    from google.genai import types
    from google.genai.errors import ServerError

    client = genai.Client(api_key=GEMINI_API_KEY)

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

        except Exception as e:
            if attempt == max_retries - 1:
                raise RuntimeError(f"Gagal menghubungi layanan Gemini: {str(e)}")
            time.sleep(2)

    raise RuntimeError("Gagal menghasilkan respons dari Gemini setelah beberapa percobaan")


def _generate_with_groq(
    prompt: str,
    max_retries: int = 3,
) -> str:
    from groq import Groq

    client = Groq(api_key=GROQ_API_KEY)

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
                max_tokens=8192,
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

    raise RuntimeError("Gagal menghasilkan respons dari Groq setelah beberapa percobaan")


def generate_soal(
    jumlah_soal: int,
    tipe_soal: str,
    mata_pelajaran: str,
    difficulty: str,
    include_pembahasan: bool,
    include_gambar: bool,
    konten_modul: str,
    topik: str = "",
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
    )

    if AI_PROVIDER == "groq":
        response_text = _generate_with_groq(prompt, max_retries)
    else:
        response_text = _generate_with_gemini(prompt, max_retries)

    soal_list = _parse_ai_response(response_text)

    if not soal_list:
        raise ValueError("AI menghasilkan daftar soal kosong")

    return soal_list
