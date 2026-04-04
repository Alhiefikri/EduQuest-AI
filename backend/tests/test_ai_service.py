import json
from unittest.mock import MagicMock, patch

import pytest

from app.services.ai_service import _build_user_prompt, _parse_ai_response


class TestBuildUserPrompt:
    def test_build_user_prompt_with_fase_kelas(self):
        prompt = _build_user_prompt(
            jumlah_soal=5,
            tipe_soal="pilihan_ganda",
            mata_pelajaran="IPAS",
            topik="Energi",
            difficulty="sedang",
            include_pembahasan=True,
            include_gambar=False,
            konten_modul="Energi tidak dapat dimusnahkan.",
            fase_kelas="Fase B / Kelas 4",
        )
        assert "Fase/Kelas: Fase B / Kelas 4" in prompt
        assert "Mata Pelajaran: IPAS" in prompt
        assert "Buat 5 soal pilihan ganda" in prompt
        assert "Energi tidak dapat dimusnahkan" in prompt
        assert "DILARANG KERAS" in prompt
        assert "Contextual Storytelling" in prompt

    def test_build_user_prompt_default_fase_kelas(self):
        prompt = _build_user_prompt(
            jumlah_soal=1,
            tipe_soal="isian",
            mata_pelajaran="Bahasa Indonesia",
            topik="",
            difficulty="mudah",
            include_pembahasan=False,
            include_gambar=True,
            konten_modul="Kancil dan Buaya.",
        )
        assert "Fase/Kelas: umum" in prompt
        assert "Mata Pelajaran: Bahasa Indonesia" in prompt
        assert "Buat 1 soal isian singkat" in prompt


class TestParseAIResponse:
    def test_parse_standard_json_format(self):
        response = json.dumps({
            "soal": [
                {
                    "nomor": 1,
                    "pertanyaan": "Berapa hasil dari 2 + 2?",
                    "pilihan": ["A. 3", "B. 4", "C. 5", "D. 6"],
                    "jawaban": "B",
                    "pembahasan": "2 + 2 = 4",
                    "gambar_prompt": None,
                }
            ]
        })
        result = _parse_ai_response(response)
        assert len(result) == 1
        assert result[0]["nomor"] == 1
        assert result[0]["jawaban"] == "B"

    def test_parse_json_with_markdown_code_block(self):
        response = """```json
{
  "soal": [
    {"nomor": 1, "pertanyaan": "Test?", "jawaban": "A"}
  ]
}
```"""
        result = _parse_ai_response(response)
        assert len(result) == 1
        assert result[0]["pertanyaan"] == "Test?"

    def test_parse_json_with_backticks_only(self):
        response = """```
{"soal": [{"nomor": 1, "pertanyaan": "Test?", "jawaban": "A"}]}
```"""
        result = _parse_ai_response(response)
        assert len(result) == 1

    def test_parse_direct_list_format(self):
        response = json.dumps([
            {"nomor": 1, "pertanyaan": "Test?", "jawaban": "A"}
        ])
        result = _parse_ai_response(response)
        assert len(result) == 1
        assert result[0]["nomor"] == 1

    def test_parse_json_with_chatter_around(self):
        response = "Tentu, ini soalnya: {\"soal\": [{\"nomor\": 1, \"pertanyaan\": \"Test?\", \"jawaban\": \"A\"}]} Semoga membantu!"
        result = _parse_ai_response(response)
        assert len(result) == 1
        assert result[0]["pertanyaan"] == "Test?"

    def test_parse_invalid_json_raises_error(self):
        with pytest.raises(json.JSONDecodeError):
            _parse_ai_response("this is not json")

    def test_parse_unrecognized_format_raises_error(self):
        response = json.dumps({"unexpected_key": "value"})
        with pytest.raises(ValueError, match="tidak dikenali"):
            _parse_ai_response(response)

    def test_parse_multiple_soal(self):
        response = json.dumps({
            "soal": [
                {"nomor": 1, "pertanyaan": "Soal 1?", "jawaban": "A"},
                {"nomor": 2, "pertanyaan": "Soal 2?", "jawaban": "B"},
                {"nomor": 3, "pertanyaan": "Soal 3?", "jawaban": "C"},
            ]
        })
        result = _parse_ai_response(response)
        assert len(result) == 3
