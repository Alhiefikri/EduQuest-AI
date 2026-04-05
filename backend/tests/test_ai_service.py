import json
from unittest.mock import MagicMock, patch

import pytest

from app.services.ai_service import (
    _build_user_prompt,
    _parse_ai_response,
    _validate_soal_item,
    _smart_truncate,
    _get_fase_detail,
    FASE_GUIDELINES,
)


class TestBuildUserPrompt:
    def test_build_user_prompt_with_fase_kelas(self):
        prompt = _build_user_prompt(
            jumlah_soal=5,
            tipe_soal="pilihan_ganda",
            mata_pelajaran="IPAS",
            topik="Energi",
            difficulty="sedang",
            gaya_soal="light_story",
            include_pembahasan=True,
            include_gambar=False,
            konten_modul="Energi tidak dapat dimusnahkan.",
            fase_kelas="Fase B / Kelas 4",
        )
        assert "Fase B" in prompt
        assert "Mapel: IPAS" in prompt
        assert "Buat 5 soal pilihan ganda" in prompt
        assert "Energi tidak dapat dimusnahkan" in prompt
        assert "DILARANG KERAS" in prompt
        assert "Gaya: Cerita Ringan" in prompt
        assert "Panduan Wajib untuk Fase Ini:" in prompt

    def test_build_user_prompt_default_fase_kelas(self):
        prompt = _build_user_prompt(
            jumlah_soal=1,
            tipe_soal="isian",
            mata_pelajaran="Bahasa Indonesia",
            topik="",
            difficulty="mudah",
            gaya_soal="formal_academic",
            include_pembahasan=False,
            include_gambar=True,
            konten_modul="Kancil dan Buaya.",
        )
        assert "umum" in prompt
        assert "Mapel: Bahasa Indonesia" in prompt
        assert "Buat 1 soal isian singkat" in prompt


class TestGetFaseDetail:
    def test_exact_match(self):
        assert _get_fase_detail("Fase A") == FASE_GUIDELINES["Fase A"]

    def test_substring_match(self):
        assert _get_fase_detail("Fase A / Kelas 1") == FASE_GUIDELINES["Fase A"]
        assert _get_fase_detail("Fase B / Kelas 4") == FASE_GUIDELINES["Fase B"]
        assert _get_fase_detail("Fase D / Kelas 8") == FASE_GUIDELINES["Fase D"]

    def test_fallback_to_umum(self):
        assert _get_fase_detail("umum") == FASE_GUIDELINES["umum"]
        assert _get_fase_detail("unknown") == FASE_GUIDELINES["umum"]


class TestSmartTruncate:
    def test_short_content_not_truncated(self):
        content = "Short content"
        assert _smart_truncate(content) == content

    def test_long_content_with_keywords(self):
        content = "Fotosintesis adalah proses penting. " * 500
        result = _smart_truncate(content, topik="Fotosintesis", mata_pelajaran="Biologi")
        assert len(result) <= 8000 + 50
        assert "Konten diseleksi berdasarkan relevansi topik" in result

    def test_no_keywords_fallback(self):
        content = "Some content " * 500
        result = _smart_truncate(content, topik="", mata_pelajaran="")
        assert len(result) <= 8000 + 50
        assert "Konten diringkas" in result


class TestValidateSoalItem:
    def test_valid_soal(self):
        soal = {
            "nomor": 1,
            "pertanyaan": "Berapa 2+2?",
            "pilihan": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "jawaban": "D",
        }
        valid, reason = _validate_soal_item(soal, "pilihan_ganda")
        assert valid is True
        assert reason == "ok"

    def test_empty_pertanyaan(self):
        soal = {"pertanyaan": "", "jawaban": "A"}
        valid, reason = _validate_soal_item(soal, "pilihan_ganda")
        assert valid is False
        assert "pertanyaan" in reason

    def test_placeholder_pertanyaan(self):
        soal = {"pertanyaan": "...", "jawaban": "A"}
        valid, reason = _validate_soal_item(soal, "pilihan_ganda")
        assert valid is False

    def test_empty_jawaban(self):
        soal = {"pertanyaan": "Test?", "jawaban": ""}
        valid, reason = _validate_soal_item(soal, "pilihan_ganda")
        assert valid is False

    def test_less_than_4_pilihan(self):
        soal = {
            "pertanyaan": "Test?",
            "pilihan": ["A. 1", "B. 2"],
            "jawaban": "A",
        }
        valid, reason = _validate_soal_item(soal, "pilihan_ganda")
        assert valid is False
        assert "pilihan" in reason

    def test_invalid_jawaban_letter(self):
        soal = {
            "pertanyaan": "Test?",
            "pilihan": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "jawaban": "E",
        }
        valid, reason = _validate_soal_item(soal, "pilihan_ganda")
        assert valid is False
        assert "bukan A/B/C/D" in reason

    def test_identical_pilihan(self):
        soal = {
            "pertanyaan": "Test?",
            "pilihan": ["A. Sama", "B. Sama", "C. Sama", "D. Sama"],
            "jawaban": "A",
        }
        valid, reason = _validate_soal_item(soal, "pilihan_ganda")
        assert valid is False
        assert "identik" in reason

    def test_essay_no_pilihan_validation(self):
        soal = {"pertanyaan": "Jelaskan!", "jawaban": "Essay answer"}
        valid, reason = _validate_soal_item(soal, "essay")
        assert valid is True


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
