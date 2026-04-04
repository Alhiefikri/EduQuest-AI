import json
import time
from typing import List

from google import genai
from google.genai import types
from google.genai.errors import ServerError

from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

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

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=0.7,
        max_output_tokens=8192,
        response_mime_type="application/json",
    )

    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=config,
            )

            response_text = response.text
            soal_list = _parse_ai_response(response_text)

            if not soal_list:
                raise ValueError("AI menghasilkan daftar soal kosong")

            return soal_list

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
                raise RuntimeError(f"Gagal menghubungi layanan AI: {str(e)}")
            time.sleep(2)

    raise RuntimeError("Gagal menghasilkan soal setelah beberapa percobaan")
