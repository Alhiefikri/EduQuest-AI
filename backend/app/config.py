import json
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
DATABASE_URL = os.getenv("DATABASE_URL", f"file:{BASE_DIR}/data/soal.db")
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

SETTINGS_FILE = BASE_DIR / "data" / "ai_settings.json"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
TEMPLATES_DIR = BASE_DIR / "templates"
OUTPUTS_DIR = BASE_DIR / "outputs"
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)


def _load_runtime_settings() -> dict:
    if SETTINGS_FILE.exists():
        try:
            with open(SETTINGS_FILE) as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def get_ai_config() -> tuple[str, str]:
    settings = _load_runtime_settings()
    provider = settings.get("provider") or os.getenv("AI_PROVIDER", "gemini")
    gemini_key = settings.get("gemini_api_key") or os.getenv("GEMINI_API_KEY", "")
    groq_key = settings.get("groq_api_key") or os.getenv("GROQ_API_KEY", "")
    api_key = groq_key if provider == "groq" else gemini_key
    return provider, api_key


def save_ai_settings(provider: str, gemini_api_key: str = "", groq_api_key: str = "") -> dict:
    settings = _load_runtime_settings()
    if provider == "groq":
        settings["provider"] = "groq"
        if groq_api_key:
            settings["groq_api_key"] = groq_api_key
    else:
        settings["provider"] = "gemini"
        if gemini_api_key:
            settings["gemini_api_key"] = gemini_api_key

    SETTINGS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f)

    return settings


def get_ai_settings_response() -> dict:
    settings = _load_runtime_settings()
    provider = settings.get("provider") or os.getenv("AI_PROVIDER", "gemini")
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    groq_key = os.getenv("GROQ_API_KEY", "")

    gemini_masked = _mask_key(settings.get("gemini_api_key") or gemini_key)
    groq_masked = _mask_key(settings.get("groq_api_key") or groq_key)

    return {
        "provider": provider,
        "gemini_api_key": gemini_masked,
        "groq_api_key": groq_masked,
        "gemini_configured": bool(settings.get("gemini_api_key") or gemini_key),
        "groq_configured": bool(settings.get("groq_api_key") or groq_key),
    }


def _mask_key(key: str) -> str:
    if not key:
        return ""
    if len(key) <= 8:
        return "****"
    return key[:4] + "****" + key[-4:]
