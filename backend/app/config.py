import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
DATABASE_URL = os.getenv("DATABASE_URL", f"file:{BASE_DIR}/data/soal.db")
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
TEMPLATES_DIR = BASE_DIR / "templates"
OUTPUTS_DIR = BASE_DIR / "outputs"
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)


async def _get_db_settings() -> dict:
    from app.database.connection import get_db
    db = await get_db()
    settings = {}
    try:
        rows = await db.appsettings.find_many()
        for row in rows:
            settings[row.key] = row.value
    except Exception:
        pass
    return settings


async def _save_db_setting(key: str, value: str) -> None:
    from app.database.connection import get_db
    db = await get_db()
    await db.appsettings.upsert(
        where={"key": key},
        data={
            "update": {"value": value},
            "create": {"key": key, "value": value},
        },
    )


async def get_ai_config() -> tuple[str, str]:
    settings = await _get_db_settings()
    provider = settings.get("ai_provider") or os.getenv("AI_PROVIDER", "gemini")
    gemini_key = settings.get("gemini_api_key") or os.getenv("GEMINI_API_KEY", "")
    groq_key = settings.get("groq_api_key") or os.getenv("GROQ_API_KEY", "")
    api_key = groq_key if provider == "groq" else gemini_key
    return provider, api_key


async def save_ai_settings(provider: str, gemini_api_key: str = "", groq_api_key: str = "") -> dict:
    settings = await _get_db_settings()
    if provider == "groq":
        settings["ai_provider"] = "groq"
        await _save_db_setting("ai_provider", "groq")
        if groq_api_key:
            settings["groq_api_key"] = groq_api_key
            await _save_db_setting("groq_api_key", groq_api_key)
    else:
        settings["ai_provider"] = "gemini"
        await _save_db_setting("ai_provider", "gemini")
        if gemini_api_key:
            settings["gemini_api_key"] = gemini_api_key
            await _save_db_setting("gemini_api_key", gemini_api_key)

    return settings


async def get_ai_settings_response() -> dict:
    settings = await _get_db_settings()
    provider = settings.get("ai_provider") or os.getenv("AI_PROVIDER", "gemini")
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
